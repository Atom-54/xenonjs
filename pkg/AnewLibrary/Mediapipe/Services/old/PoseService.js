/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './PoseServiceLoader.js';

//let waitFor = 0;

// JIT
const pose = await globalThis.requirePose();

//const dom = (tag, props, container) => (container ?? document.body).appendChild(Object.assign(document.createElement(tag), props));
//const canvas = dom('canvas', {width: 640, height: 480, style: 'display: none;'});
//dom('iframe', {src: '../Library/Mediapipe/smoke/pose-raw-smoke.html', style: 'display: inline-block; height: 240px;'});

export const PoseService = {
  async classify(app, atom, {image}) {
     // don't hammer the mediapipe
    if (!PoseService.classify.busy) {
      PoseService.classify.busy = true;
      try {
        // must be a real boy
        const realImage = Resources.get(image?.canvas);
        // confirm stability
        if (realImage?.width && realImage?.height) {
          //const ctx = canvas.getContext('2d');
          //ctx.drawImage(realImage, 0, 0);
          const result = await classifyPose(realImage);
          const {poseLandmarks} = result;
          return {poseLandmarks}
        }
      } finally {
        PoseService.classify.busy = false;
      }
    }
  }
};

let poseData;

const classifyPose = image => {
  // convert callback to async syntax (sampling)
  return new Promise(async resolve => {
    pose.onResults(results => {
      poseData = results;
    });
    await pose.send({image});
    resolve(poseData);
    //console.log('returned', poseData);
  });
};
