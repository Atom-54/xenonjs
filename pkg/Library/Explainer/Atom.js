// atoms expect some dependencies to be injected
// `log`: a logger instance 
// `resolve`: path resolver, to expand paths that contain `$<name>` macros
export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// called once when atom is created
// all lifecycle methods take three dictionary arguments
// inputs: readonly bag of input data
// state: read-write bag of state data, only for use by the Atom itself
// tools: readonly bag of system functions
// any lifecycle methods may return an `output` dictionary
async initialize(inputs, state, tools) {
  if (!state.number) {
    state.number = Math.random();
    return {number: state.number};
  }
},
// called whenever `inputs` change (and once at startup)
async update(inputs, state, tools) {
},
// (optional) 
// By default the render-channel filled with inputs and state data.
// Implement render to return a custom render-channel model.
render({}, {number}) {
  return {
    number: number.toPrecision(3)
  };
},
// event callbacks are also "lifecycle" methods
onNumberTap(inputs, state) {
  state.number = Math.random();
  return {number: state.number};
},
// if you provide a template, it's also sent on the render-channel
// and can product object if there is a compatible renderer on the other-side
// note that `template` is just a String; there is no DOM dependency here
// the `html` template tag exists only to hint syntax-hightlighters
template: html`
<span on-tap="onNumberTap">{{number}}</span>
`
});
  