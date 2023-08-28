export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state) {
  state.leftSets = {
    frameSets: [], 
    smoothFrame: []
  };
  state.rightSets = {
    frameSets: [], 
    smoothFrame: []
  };
},
shouldUpdate({results}) {
  return results;
},
async update({results}, state, {service}) {
  const tracking = this.getTracking(results, state);
  state.left = tracking.left;
  state.right = tracking.right;
  return {tracking};
},
getTracking(results, {left, right, leftSets, rightSets}) {
  const lastLeft = left;
  if (results?.leftHandLandmarks) {
    //log("LEFT FINGY");
    const leftPointer = results.leftHandLandmarks?.slice(-16, -12);
    const leftSmooth = this.smoothenate(leftSets, leftPointer);
    left = this.computePointer(leftSmooth);
  } else left = null;
  //
  const lastRight = right;
  if (results?.rightHandLandmarks) {
    //log("RIGHT FINGY");
    const rightPointer = results.rightHandLandmarks?.slice(-16, -12);
    const rightSmooth = this.smoothenate(rightSets, rightPointer);
    right = this.computePointer(rightSmooth);
  } else right = null;
  return {lastLeft, left, lastRight, right};
},
smoothenate({frameSets, smoothFrame}, landmarks) {
  // Pushing frame at the end of frameSet array
  frameSets.push(landmarks);
  if (frameSets.length === 8) {
    const l = frameSets[0].length;
    for (let i = 0; i < l; i++) {
      // Making an array of each joint coordinates
      let x = frameSets.map(a => a[i].x);
      let y = frameSets.map(a => a[i].y);
      let z = frameSets.map(a => a[i].z);
      let visibility = frameSets.map((a) => a[i].visibility);
      // Sorting the array into ascending order
      x = x.sort((a, b) => a - b);
      y = y.sort((a, b) => a - b);
      z = z.sort((a, b) => a - b);
      visibility = visibility.sort((a, b) => a - b);
      // Dropping 2 min and 2 max coordinates
      x = x.slice(2, 6);
      y = y.slice(2, 6);
      z = z.slice(2, 6);
      visibility = visibility.slice(2, 6);
      // Making the average of 4 remaining coordinates
      smoothFrame[i] = {
        x: x.reduce((a, b) => a + b, 0) / x.length,
        y: y.reduce((a, b) => a + b, 0) / y.length,
        z: z.reduce((a, b) => a + b, 0) / z.length,
        visibility: visibility.reduce((a, b) => a + b, 0) / visibility.length,
      };
    }
    // Removing the first frame from frameSet
    frameSets.shift();
  }
  // after first 8 frames we have averaged coordinates, So now updating the poseLandmarks with averaged coordinates
  if (smoothFrame.length > 0) {
    return smoothFrame;
  }
  return landmarks;
},
computePointer(pointer) {
  const [p0, p1, p2, p3] = pointer;
  const ray = {x: p3.x-p1.x, y: p3.y-p1.y, z: p3.z-p1.z};
  const mag = Math.sqrt(ray.x*ray.x + ray.y*ray.y, ray.z*ray.z);
  //const norm = {x: ray.x/mag, y: ray.y/mag, z: ray.z/mag};
  // finger points up
  //if (-norm.y > 0.9) {
  // finger is extended?
  if (mag < 0.06) {
    return null;
  }
  // target coordinates appear to be 0..0.5..1
  // norm coordinates are -1..0..1
  const pt = p3;
  // orthogonal projection into 'screen space'
  const target = {x: pt.x, y: pt.y, z: 0};
  //
  return target;
}
});
    