export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.canvasOut = await service('MediaService', 'allocateCanvas', {width: 1280, height: 720});
  state.requireCanvas = async image => service('ImageService', 'canvasFromImage', image);
  state.compose = async data => service('ImageService', 'compose', data);
},
async update({imageA, imageB, imageC, imageD, opA, opB, opC, opD}, {canvasOut, requireCanvas, compose}) {
  if (imageA) {
    let lastOp;
    const operations = [opA, opB, opC, opD].map(o => o ? (lastOp = o) : lastOp);
    const images = [imageA, imageB, imageC, imageD];
    for (let image of images) {
      if (image && !image.canvas) {
        image.canvas = await requireCanvas(image);
        log('after requireCanvas:', image);
      }
    }
    await compose({images, operations, canvasOut});
    return {output: {canvas: canvasOut, version: Math.random()}};
  }
}
});
