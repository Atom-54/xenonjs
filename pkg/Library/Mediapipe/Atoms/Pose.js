export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({image}) {
  return image;
},
async update({image}, state, {service}) {
  let pose = await service({kind: 'PoseService', msg: 'classify', data: {image}});
  if (pose !== undefined) {
    //log('got pose result', pose);
  }
  pose ??= {
    poseLandmarks: {
      11: {x:0, y:10, z:0}, // shoulder a
      12: {x:0, y:10, z:0}, // shoulder b
      13: {x:0, y:20, z:0}, // elbow a
      14: {x:0, y:10, z:0}, // elbow b
    }
  };
  return {pose};
}
});
