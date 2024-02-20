type PoseNet = (arg0: HTMLVideoElement, arg1?: () => void) => Promise<any>;

type PoseNetResponse = {
  on?: (arg0: string, arg1: (result: any) => void) => void;
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

export type { PoseNet, PoseNetResponse, PoseNetPose };