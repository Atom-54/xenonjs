export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({frame}) {
  return frame;
},
async update({frame}, state, {service}) {
  if (frame.canvas !== state.lastCanvas) {
    state.lastCanvas = frame.canvas;
    const stream = await service('MediaService', 'captureStream', {frame});
    return {stream};
  }
}
});
