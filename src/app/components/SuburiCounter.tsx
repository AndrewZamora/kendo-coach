'use client'
import VideoCanvas from "./VideoCanvas";
import Counter from "./Counter";
import { useState, useRef, RefObject } from 'react';
import calculateMidAngle from '../utilities/utilities';

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

let mirrored = false;

export default function SuburiCounter() {
  const [count, setCount] = useState(0);
  let pose = useRef<null | any>(null);
  let status = useRef<null | string>(null);
  let skeleton = useRef<null | any>(null);
  let skeletonColor = '#16FF00'
  let width = 720;
  let height = 540;


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

  function handlePose([poses]: [PoseNetPose]) {
    if (poses) {
      pose.current = poses.pose;
      skeleton.current = poses.skeleton;
      handleAngles(pose.current)
    }
  }

  function handleAngles(pose: PoseNetPose["pose"]) {
    const { rightWrist, rightElbow, rightShoulder, rightHip, leftHip, leftShoulder, leftElbow, leftWrist } = pose;
    let elbow = { right: 0, left: 0 };
    let armpit = { right: 0, left: 0 };
    elbow.right = 180 - calculateMidAngle([rightShoulder.x, rightShoulder.y], [rightElbow.x, rightElbow.y], [rightWrist.x, rightWrist.y]);
    elbow.left = 180 - calculateMidAngle([leftShoulder.x, leftShoulder.y], [leftElbow.x, leftElbow.y], [leftWrist.x, leftWrist.y]);
    armpit.right = 180 - calculateMidAngle([rightElbow.x, rightElbow.y], [rightShoulder.x, rightShoulder.y], [rightHip.x, rightHip.y]);
    armpit.left = 180 - calculateMidAngle([leftElbow.x, leftElbow.y], [leftShoulder.x, leftShoulder.y], [leftHip.x, leftHip.y]);
    poseAngles.elbow = elbow;
    poseAngles.armpit = armpit;
    if (status.current !== 'up' && poseAngles.armpit.right > 110 && poseAngles.armpit.left > 110) {
      status.current = 'up';
    }
    if (status.current && status.current === 'up' && poseAngles.armpit.right < 70 && poseAngles.armpit.left < 70) {
      status.current = 'down';
      setCount((count) => count + 1);
    }
  }

  function handleDraw(context: CanvasRenderingContext2D, video: RefObject<HTMLVideoElement>) {
    if (video.current && context) {
      if (!mirrored) {
        context.translate(width, 0);
        context.scale(-1, 1);
        mirrored = true;
      }
      context.drawImage(video.current, 0, 0, width, height);
      if (pose.current && skeleton.current) {
        context.fillStyle = skeletonColor;
        context.strokeStyle = skeletonColor;
        context.lineWidth = 5;
        context.lineCap = 'round'
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
    <>
      <VideoCanvas
        height={height}
        width={width}
        mirror={true}
        onPose={handlePose}
        onDraw={handleDraw} />
      <Counter count={count} /> 
    </>
  )
}