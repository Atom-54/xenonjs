/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// TODO(sjmiles): this script file exists because `pose`
// library seemed to be happier loaded from non-module
// environment, and I didn't have time to investigate.

//const root = `${globalThis.config.xenonPath}/third-party/mediapipe/pose`;
const root = `../third-party/mediapipe/pose`;
const locateFile = file => `../${root}/${file}`;

let pose;

globalThis.requirePose = async () => {
  if (!globalThis.Pose) {
    await import(`../../${root}/pose.js`);
  }
  //
  if (!pose) {
    pose = new globalThis.Pose({locateFile});
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    pose.initialize();
  }
  //
  return pose;
};
