export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(_, state, {service}) {
  state.target = await service({kind: 'MediaService', msg: 'allocateCanvas', data: {width: 640, height: 480}});
  state.renderFace = (data, target) => service({kind: 'FaceMeshService', msg: 'renderFace', data: {data, target}});
},
shouldUpdate({data}) {
  return Boolean(data);
},
async update({data}, state, {service}) {
  await state.renderFace(data.results, state.target);
  state.outputImage = {
    canvas: state.target,
    version: Math.random()
  };
  return {image: state.outputImage};
},
render({data}, {outputImage}) {
  return {
    image: outputImage,
    stream: data?.image?.stream
  };
},
template: html`
<style>
  :host {
    position: relative;
    display: flex;
  }
  image-resource {
    position: absolute;
    inset: 0;
  }
</style>
<stream-view flex stream="{{stream}}"></stream-view>
<image-resource flex image="{{image}}"></image-resource>
`
});
