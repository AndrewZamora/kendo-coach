'use client'
import React, { useEffect, useRef } from 'react'
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
}

let navigatorIsReady = false;

function VideoCanvas({ height, width }: Props) {
  let canvas = useRef<HTMLCanvasElement>(null)
  let video = useRef<HTMLVideoElement>(null);
  let context: null | CanvasRenderingContext2D | undefined = null;
  let constraints = { video: true }
  let _poseNet: null | any = null;
  let pose: null | any = null;
  let skeleton: null | any = null;

  function poseNetLoaded() {
    console.log("loaded")
  }
  function handlePose(poses: [object, object]) {
    if (poses.length) {
      pose = poses[0].pose;
      skeleton = poses[0].skeleton;
    }
  }
  function updateCanvas() {
    if (video && video.current && canvas && canvas.current) {
      context?.drawImage(video.current, 0, 0, canvas.current.width, canvas.current.height);
      if (pose && context) {
        context.fillStyle = 'red';
        context.strokeStyle = 'red';
        for (let i = 0; i < pose.keypoints.length; i++) {
          let x = pose.keypoints[i].position.x
          let y = pose.keypoints[i].position.y
          context.strokeRect(x - 32, y - 32, 64, 64);
        }
        context.stroke();
        context.beginPath();
        for (let i = 0; i < skeleton.length; i++) {
          let a = skeleton[i][0];
          let b = skeleton[i][1];
          context.moveTo(a.position.x, a.position.y);
          context.lineTo(b.position.x, b.position.y);
        }
        context.stroke();
      }
    }
    requestAnimationFrame(updateCanvas);
  }
  useEffect(() => {
    return () => {
      if (video && video.current) {
        video.current.removeEventListener('play', updateCanvas);
      }
    }
  }, [])
  function handleMediaStream(mediaStream: MediaStream) {
    if (video && video.current) {
      if (video.current && "srcObject" in video.current) {
        video.current.srcObject = mediaStream;
      }
      context = canvas.current?.getContext('2d');
    }
    if (video && video.current) {
      video.current.addEventListener('play', updateCanvas);
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
  return (
    <div>
      <video ref={video} height={height} width={width} autoPlay></video>
      <canvas ref={canvas} height={height} width={width}></canvas>
    </div>

  )
}

export default VideoCanvas