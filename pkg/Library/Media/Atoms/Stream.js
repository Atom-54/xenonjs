export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize({}, state) {
  state.stream = {id: 'default', version: 0}; 
},
update({stream}, state) {
  state.stream = (stream ??= state.stream);
  return {stream};
},
render({}, {stream}) {
  return {
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
<stream-view flex stream="{{id}}"></stream-view>
`
});
