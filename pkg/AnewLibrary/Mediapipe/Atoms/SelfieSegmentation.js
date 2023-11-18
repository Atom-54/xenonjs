export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.target = await service({kind: 'MediaService', msg: 'allocateCanvas', data: {width: 640, height: 480}});
},
async update({image}, state, {service}) {
  const mask = await this.segment(service, {image, target: state.target});
  // for the renderer
  state.mask = mask;
  return {mask};
},
async segment(service, data) {
  return service({kind: 'SelfieSegmentationService', msg: 'classify', data});
}
// template: html`
// <style>
//   :host {
//     display: flex;
//     flex-direction: column;
//     background-color: black;
//     color: #eee;
//     overflow: hidden;
//   }
// </style>
// <image-resource center flex image="{{mask}}"></image-resource>
// `
});
