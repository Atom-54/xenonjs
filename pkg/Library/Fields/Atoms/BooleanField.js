export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value}, state) {
  state.value = value;
  return {value};
},
onValueChange({eventlet: {value}}, state) {
  // because checkboxes are eccentric
  value = !state.value;
  log('onValueChange', value);
  // this is done so the renderer can 
  // have it right away
  state.value = value;
  // output may come back eventually 
  // as input
  return {value};
},
template: html`
<style>
  :host {
    padding: 0 6px;
    /* height: 2em;
    width: 6em; */
  }
  [label] {
    background: inherit;
    font-weight: bold;
    font-size: 75%;
    border: none;
    text-align: right;
    min-width: var(--field-label-width);
  }
  [delim] {
    padding-right: 9px;
  }
</style>
<div flex bar>
  <div label>{{label}}</div>
  <span delim></span>
  <input field type="checkbox" checked="{{value}}" on-change="onValueChange">
</div>
`
});
