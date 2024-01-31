'use client'
import React, { useRef, useState } from 'react';
import calculateMidAngle from '../utilities/utilities';
import Counter from './Counter';
import useCanvas from './useCanvas';
// https://github.com/ml5js/ml5-library/issues/570
const ml5 = require('ml5');
type PoseNet = (arg0: HTMLVideoElement, arg1?: () => void) => Promise<any>;

type PoseNetResponse = {
  on?: (arg0: string, arg1: (result: any) => void) => void
}
const { poseNet }: { poseNet: PoseNet } = ml5;

type Props = {
  height: number,
  width: number,
  mirror?: boolean,
}

type Angles = {
  armpit?: {
    right: number,
    left: number
  },
  elbow?: {
    right: number,
    left: number
  },
}

let navigatorIsReady = false;
let mirrored = false;

let poseAngles = {
  armpit: {
    right: 0,
    left: 0
  },
  elbow: {
    right: 0,
    left: 0
  }
};

function VideoCanvas({ height, width, mirror }: Props) {
  const [count, setCount] = useState(0);
  let video = useRef<HTMLVideoElement>(null);
  const canvas = useCanvas({ draw })
  let constraints = { video: true }
  let _poseNet: null | any = null;
  let pose = useRef<null | any>(null);
  let status = useRef<null | string>(null);
  let skeleton = useRef<null | any>(null);
  let mediaStream: MediaStream | null = null;

  function poseNetLoaded() {
    console.log("loaded")
  }

  function handlePose(poses: [object, object]) {
    if (poses.length) {
      pose.current = poses[0].pose;
      skeleton.current = poses[0].skeleton;
      handleAngles(pose.current)
    }
  }

  function handleMediaStream(stream: MediaStream) {
    mediaStream = stream
    if (video && video.current) {
      if (video.current && "srcObject" in video.current) {
        video.current.srcObject = mediaStream;
      }
      _poseNet = poseNet(video.current, poseNetLoaded);
      if (_poseNet) {
        _poseNet.on('pose', handlePose);
      }
    }
  }

  if (typeof window !== 'undefined') {
    if (!navigatorIsReady) {
      navigatorIsReady = true
      navigator.mediaDevices.getUserMedia(constraints).then((mediaStream: MediaStream) => handleMediaStream(mediaStream));
    }
  }

  function handleAngles(pose) {
    const { rightWrist, rightElbow, rightShoulder, rightHip, leftHip, leftShoulder, leftElbow, leftWrist } = pose;
    let elbow = { right: 0, left: 0 };
    let armpit = { right: 0, left: 0 };
    elbow.right = 180 - calculateMidAngle([rightShoulder.x, rightShoulder.y], [rightElbow.x, rightElbow.y], [rightWrist.x, rightWrist.y]);
    elbow.left = 180 - calculateMidAngle([leftShoulder.x, leftShoulder.y], [leftElbow.x, leftElbow.y], [leftWrist.x, leftWrist.y]);
    armpit.right = 180 - calculateMidAngle([rightElbow.x, rightElbow.y], [rightShoulder.x, rightShoulder.y], [rightHip.x, rightHip.y]);
    armpit.left = 180 - calculateMidAngle([leftElbow.x, leftElbow.y], [leftShoulder.x, leftShoulder.y], [leftHip.x, leftHip.y]);
    poseAngles.elbow = elbow;
    poseAngles.armpit = armpit;
    // console.table({ armpit, elbow })
    if (status.current !== 'up' && poseAngles.armpit.right > 110 && poseAngles.armpit.left > 110) {
      status.current = 'up';
    }
    if (status.current && status.current === 'up' && poseAngles.armpit.right < 70 && poseAngles.armpit.left < 70) {
      status.current = 'down';
      setCount((count) => count + 1);
    }
  }

  function draw(context: CanvasRenderingContext2D) {
    if (video.current && context) {
      if (!mirrored) {
        context.translate(width, 0);
        context.scale(-1, 1);
        mirrored = true;
      }
      context.drawImage(video.current, 0, 0, width, height);
      if (pose.current && skeleton.current) {
        context.fillStyle = 'red';
        context.strokeStyle = 'red';
        for (let i = 0; i < pose.current.keypoints.length; i++) {
          let x = pose.current.keypoints[i].position.x
          let y = pose.current.keypoints[i].position.y
          context.strokeRect(x - 32, y - 32, 64, 64);
        }
        // context.stroke();
        context.beginPath();
        for (let i = 0; i < skeleton.current.length; i++) {
          let a = skeleton.current[i][0];
          let b = skeleton.current[i][1];
          context.moveTo(a.position.x, a.position.y);
          context.lineTo(b.position.x, b.position.y);
        }
        context.stroke();
      }
    }
  }

  function setMirror() {
    const context = canvas.current?.getContext('2d')
    if (context) {
      context.translate(width, 0);
      context.scale(-1, 1);
      mirrored = true;
    }
  }

  return (
    <div>
      <video ref={video} height={height} width={width} autoPlay></video>
      <canvas ref={canvas} height={height} width={width}></canvas>
      <button onClick={setMirror}>mirror</button>
      <Counter count={count} />
    </div>

  )
}

export default VideoCanvas