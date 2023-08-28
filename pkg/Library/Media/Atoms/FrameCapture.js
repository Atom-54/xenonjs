/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const atom = (log, resolve) => ({
render({fps, stream}, {}) {
  return {
    fps,
    stream: stream?.id
  };
},
onCanvas({eventlet: {value: ref}, stream}) {
  return {
    frame: {
      canvas: ref,
      version: Math.random(),
      stream
    }
  };
},
template: html`
<style>
  :host {
    position: absolute;
    visibility: hidden;
    max-width: 0;
    max-height: 0;
  }
</style>
<stream-view flex stream="{{stream}}" frequency="{{fps}}" on-canvas="onCanvas"></stream-view>
`
});
