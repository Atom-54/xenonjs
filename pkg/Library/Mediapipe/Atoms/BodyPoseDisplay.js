export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  const canvas = await service({kind: 'MediaService', msg: 'allocateCanvas', data: {width: 640, height: 480}});
  state.renderPose = markers => {
    service('ImageService', 'clearCanvas', {canvas});
    service('HolisticService', 'marks', {canvas, markers, connectors: this.POSE_CONNECTIONS, options: {lineWidth: 0.5, color: 'lightblue'}});
    service('HolisticService', 'marks', {canvas, markers, options: {lineWidth: 1, radius: 2, color: 'white'}});
  };
  state.canvas = canvas;
},
shouldUpdate({data}) {
  return Boolean(data);
},
async update({data}, state, {service}) {
  await state.renderPose(data.poseLandmarks);
  state.outputImage = {
    canvas: state.canvas,
    version: Math.random()
  };
  return {image: state.outputImage};
},
render({data}, {outputImage}) {
  return {
    image: outputImage,
    stream: data?.image?.stream.id
  };
},
template: html`
<style>
  /* :host {
    display: flex;
    overflow: hidden;
  } */
  image-resource {
    position: absolute;
    inset: 0;
  }
</style>
<div flex style="position: relative; overflow: hidden;">
  <stream-view flex stream="{{stream}}"></stream-view>
  <image-resource flex image="{{image}}"></image-resource>
</div>
`,
POSE_CONNECTIONS: [
  [0, 1],   [1, 2],   [2, 3],
  [3, 7],   [0, 4],   [4, 5],
  [5, 6],   [6, 8],   [9, 10],
  [11, 12], [11, 13], [13, 15],
  [15, 17], [15, 19], [15, 21],
  [17, 19], [12, 14], [14, 16],
  [16, 18], [16, 20], [16, 22],
  [18, 20], [11, 23], [12, 24],
  [23, 24], [23, 25], [24, 26],
  [25, 27], [26, 28], [27, 29],
  [28, 30], [29, 31], [30, 32],
  [27, 31], [28, 32]
]
});
