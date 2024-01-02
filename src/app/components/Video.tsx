
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

function Video({ height, width }: Props) {
  let canvas = useRef<HTMLCanvasElement>(null)
  let video = useRef<HTMLVideoElement>(null);
  let context: null | CanvasRenderingContext2D | undefined = null;
  let constraints = { video: true }
  let _poseNet: null | any = null;
  let pose: null | any = null;
  function poseNetLoaded() {
    if (video.current) {
      const videoStyles = video.current.getBoundingClientRect()
      canvas.current?.setAttribute('height', `${videoStyles.height}`)
      canvas.current?.setAttribute('width', `${videoStyles.width}`)
    }
  }
  function handlePose(poses: [object, object]) {
    if (poses.length) {
      pose = poses[0].pose;
    }
  }
  function drawToCanvas() {
    if (video && video.current) {
      context?.drawImage(video.current, 0, 0, width, height)
      if (context && context.fillStyle && canvas.current && pose) {
        context.strokeRect(pose.nose.x - 32, pose.nose.y - 32, 64, 64)
        context.fillStyle = 'red'
        context.strokeStyle = 'red'
        context.stroke()
      }
      requestAnimationFrame(drawToCanvas)
    }
  }
  function handleMediaStream(mediaStream: MediaStream) {
    if (video && video.current) {
      if (video.current && "srcObject" in video.current) {
        video.current.srcObject = mediaStream
      }
      _poseNet = poseNet(video.current, poseNetLoaded);
      if (_poseNet) {
        _poseNet.on('pose', handlePose);
      }
      context = canvas.current?.getContext('2d');
      context?.scale(1, 1);
      drawToCanvas()
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
      <canvas ref={canvas} ></canvas>
    </div>
  )
}

export default Video