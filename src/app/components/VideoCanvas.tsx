'use client'
import React, { RefObject, useRef } from 'react';
import useCanvas from './useCanvas';
// https://github.com/ml5js/ml5-library/issues/570
const ml5 = require('ml5');
const { poseNet }: { poseNet: PoseNet } = ml5;

type PoseNet = (arg0: HTMLVideoElement, arg1?: () => void) => Promise<any>;

type PoseNetResponse = {
  on?: (arg0: string, arg1: (result: any) => void) => void
}

type Props = {
  height: number,
  width: number,
  mirror?: boolean,
  onPose: ([pose]: [PoseNetPose]) => void,
  onDraw: (context: CanvasRenderingContext2D, video: RefObject<HTMLVideoElement>) => void,
}

type poseCoordinates = {
  x: number,
  y: number,
  confidence: number
}

type PoseNetPose = {
  pose: {
    keypoints: object[],
    rightWrist: poseCoordinates,
    rightElbow: poseCoordinates,
    rightShoulder: poseCoordinates,
    rightHip: poseCoordinates,
    leftHip: poseCoordinates,
    leftShoulder: poseCoordinates,
    leftElbow: poseCoordinates,
    leftWrist: poseCoordinates
  },
  skeleton: object
}

let navigatorIsReady = false;

function VideoCanvas({ height, width, mirror, onPose, onDraw }: Props) {
  let video = useRef<HTMLVideoElement>(null);
  const canvas = useCanvas({ draw })
  let constraints = { video: true }
  let _poseNet: null | any = null;

  if (typeof window !== 'undefined') {
    if (!navigatorIsReady) {
      navigatorIsReady = true
      navigator.mediaDevices.getUserMedia(constraints).then((mediaStream: MediaStream) => handleMediaStream(mediaStream));
    }
  }

  function poseNetLoaded() {
    console.log("loaded")
  }

  function handlePose(poses: [PoseNetPose]) {
    onPose(poses)
  }

  function handleMediaStream(stream: MediaStream) {
    if (video && video.current) {
      if (video.current && "srcObject" in video.current) {
        video.current.srcObject = stream;
        video.current.play()
      }
      _poseNet = poseNet(video.current, poseNetLoaded);
      if (_poseNet) {
        _poseNet.on('pose', handlePose);
      }
    }
  }

  function draw(context: CanvasRenderingContext2D) {
    onDraw(context, video)
  }

  return (
    <>
      <video ref={video} height={height} width={width} hidden></video>
      <canvas ref={canvas} height={height} width={width}></canvas>
    </>

  )
}

export default VideoCanvas