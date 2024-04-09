'use client'
import React, { RefObject, useRef, useState } from 'react';
import useCanvas from './useCanvas';
import { PoseNetPose, PoseNet } from "../types/poseNet";
// https://github.com/ml5js/ml5-library/issues/570
const ml5 = require('ml5');
const { poseNet }: { poseNet: PoseNet } = ml5;

type Props = {
  height: number,
  width: number,
  mirror?: boolean,
  onPose: ([pose]: [PoseNetPose]) => void,
  onDraw: (context: CanvasRenderingContext2D, video: RefObject<HTMLVideoElement>) => void,
}


let navigatorIsReady = false;

function VideoCanvas({ height, width, mirror, onPose, onDraw }: Props) {
  let video = useRef<HTMLVideoElement>(null);
  const canvas = useCanvas({ draw });
  let [permissions, setPermissions] = useState(false)
  let constraints = { video: true };
  let _poseNet: null | any = null;

  if (typeof window !== 'undefined') {
    if (!navigatorIsReady) {
      navigatorIsReady = true
      navigator.mediaDevices.getUserMedia(constraints).then((mediaStream: MediaStream) => {
        setPermissions(true);
        handleMediaStream(mediaStream);
      });
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
      <div className={permissions ? 'hidden' : 'flex-1 object-cover rounded-3xl  flex items-center justify-center border-solid border-black border-2'}>Please allow permissions</div>
      <video ref={video} height={height} width={width} hidden></video>
      <canvas className={`flex-1 object-cover rounded-3xl ` + (permissions ? '' : 'invisible absolute')} ref={canvas} height={height} width={width}></canvas>
    </>

  )
}

export default VideoCanvas