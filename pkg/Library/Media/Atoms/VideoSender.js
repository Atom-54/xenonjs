export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({frame, stream}) {
  return frame || stream;
},
async update({frame, stream}, state, {service}) {
  if (!stream && frame) {
    if (frame.canvas !== state.lastCanvas) {
      state.lastCanvas = frame.canvas;
      stream = await service('MediaService', 'captureStream', {frame});
    }
  }
  if (stream) {
    this.sendStream(service, stream);
  }
  return {stream};
},
sendStream(service, stream) {
  service('MediaService', 'sendStream', {stream});
  service('SystemService', 'setResource', {id: 'videoSender', resource: stream});
}
});
