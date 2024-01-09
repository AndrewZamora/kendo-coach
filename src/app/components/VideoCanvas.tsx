'use client'
import React, { useRef } from 'react';
import Canvas from './Canvas';
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

let navigatorIsReady = false;
let mirrored = false;

function VideoCanvas({ height, width, mirror }: Props) {
  let video = useRef<HTMLVideoElement>(null);
  let constraints = { video: true }
  let _poseNet: null | any = null;
  let pose = useRef<null | any>(null);
  let skeleton = useRef<null | any>(null);
  let mediaStream: MediaStream | null = null;

  function poseNetLoaded() {
    console.log("loaded")
  }

  function handlePose(poses: [object, object]) {
    if (poses.length) {
      pose.current = poses[0].pose;
      skeleton.current = poses[0].skeleton;
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

  const draw = (context: CanvasRenderingContext2D) => {
    if (video.current && context) {
        if (!mirrored) {
          context.translate(width, 0)
          context.scale(-1, 1)
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
        context.stroke();
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

  return (
    <div>
      <video ref={video} height={height} width={width} autoPlay></video>
      <Canvas height={height} width={width} draw={draw} mirror={mirror} />
    </div>

  )
}

export default VideoCanvas