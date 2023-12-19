export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.image = {
    canvas: await service({kind: 'MediaService', msg: 'allocateCanvas', data: {width: 640, height: 480}})
  };
},
shouldUpdate({tracking}) {
  return tracking;
},
async update({tracking, penSize, eraserSize, erase, color}, state, {service}) {
  const marks = (markers, connectors, options) => 
    service('HolisticService', 'marks', 
      {canvas: state.image.canvas, markers, connectors, options}
    )
  ;
  //
  const eraserOpts = [eraserSize ?? 22, '#FFFFFFFF', 'destination-out'];
  if (erase) {
    this.drawPom(marks, tracking?.lastLeft, ...eraserOpts);
    this.drawPom(marks, tracking?.lastRight, ...eraserOpts);
  }
  //
  const penOpts = [penSize ?? 20, color ?? '#882ED0FF', 'source-over'];
  this.drawPom(marks, tracking?.left, ...penOpts);
  this.drawPom(marks, tracking?.right, ...penOpts);
  //
  return {image: {...state.image, version: Math.random()}};
},
async drawPom(marks, now, siz, color, op) {
  if (now) {
    const lineWidth = siz ?? 2;
    const radius = siz ?? 2;
    await marks([now], null, {color, lineWidth, radius, op});
  }
}
});
