export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize({}, state, {service}) {
  state.internalStream = {id: Math.floor((Math.random()*9 + 1) * 1e4), version: 1};
  //state.defaultStream = {id: 'default', version: 0}; 
},
update({stream, src}, state) {
  if (src) {
    stream = state.internalStream;
  }
  if (state.stream !== stream) {
    state.stream = stream;
    return {stream};
  }
},
render({src}, {internalStream, stream}) {
  return {
    src,
    id: stream?.id
  };
},
template: html`
<style>
  :host {
    display: flex;
    color: var(--theme-color-fg-2);
    background-color: var(--theme-color-bg-2);
    overflow: hidden;
  }
</style>
<!-- device selector slot -->
<slot name="device"></slot>
<!-- stream view -->
<stream-view flex src="{{src}}" stream="{{id}}"></stream-view>
`
});
