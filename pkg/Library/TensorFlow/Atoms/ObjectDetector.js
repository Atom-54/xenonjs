export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({image, model, display}, state, {service, output, isDirty}) {
  const kind = `${model || 'CocoSsd'}Service`;
  if (isDirty('image')) {
    this.updateImage({image, kind}, state, {service, output});
  }
  if (isDirty('display')) {
    if (display?.canvas && state.data) {
      await service(kind, 'drawBoxes', {canvas: display.canvas, data: state.data})
      display.version = Math.random();
      return {display};
    }
  }
},
async updateImage({image, kind}, state, {service, output}) {
  if (!state.classifying) {
    state.classifying = true;
    const data = await service(kind, 'classify', {image});
    state.classifying = false;
    state.data = data;
    output({data});
  }
}
});
