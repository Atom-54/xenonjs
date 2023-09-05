/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

//import {Resources} from '../App/Resources.js';
import {MediapipeClassifier} from '../MediapipeClassifier.js';

const {canvasElement} = window;

export const PoseService = {
  async classify({image}) {
    // get our input canvas object
    const realImage = canvasElement;
    //const realImage = Resources.get(image?.canvas);
    // confirm stability
    if (realImage?.width && realImage?.height) {
      // classify!
      return MediapipePoseModel.pose(realImage);
    }
  }
};

export const MediapipePoseModel = {
  ...MediapipeClassifier,
  async pose(image) {
    const pose = await this.getPose();
    console.log(pose, image);
    return this.classify(pose, image);
  },
  async getPose() {
    const Pose = await requirePose();
    //
    const pose = new Pose({locateFile});
    pose.setOptions({
      staticImageMode: true, // optimize with frame coherence, or not
      // maxNumFaces: 1,
      // modelComplexity: 1, // 0, 1, 2
      // smoothLandmarks: true,
      // minDetectionConfidence: 0.5,
      // minTrackingConfidence: 0.5
    });
    //
    this.getPose = () => pose;
    return pose;
  },
};

// late-bind the dependencies so we pay for it only when using it
const root = globalThis.config?.xenonPath;
// const root = import.meta.url.split('/').slice(0, -1).join('/');
const pose = `${root}/third-party/mediapipe/pose`;
// const local = import.meta.url.split('/').slice(0, -1).join('/');
const locateFile = file => {
  console.log(file, `${pose}/${file}`);
  return `${pose}/${file}`;
  // console.log(file, `${local}/../../third-party/mediapipe/pose/${file}`);
  // return `${local}/../../third-party/mediapipe/pose/${file}`;
};

const requirePose = async () => {
  await import(locateFile('pose.js'));
  return globalThis.Pose;
};
