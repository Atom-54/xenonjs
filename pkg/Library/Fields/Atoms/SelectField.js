export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value}, state) {
  if (state.value !== value) {
    state.value = value;
    return {value};
  }
},
render({label, value, multiple, options}, state) {
  return {
    label: label ?? '',
    value,
    multiple,
    options
  };
},
// onLabelChange({eventlet: {value}}) {
//   return {label: value};
// },
onFieldChange({eventlet: {value}}, state) {
  if (value !== state.value) {
    state.value = value;
    return {value};
  }
},
template: html`
<style>
  :host {
    padding: 0 6px;
    height: 2em;
    width: 24em;
  }
  [label] {
    background: inherit;
    font-weight: bold;
    /* font-size: 75%; */
    border: none;
    text-align: left;
    /* width: 16em; */
  }
  [delim] {
    padding-right: 12px;
  }
</style>

<div flex bar>
  <!-- <input label value="{{label}}" on-change="onLabelChange"> -->
  <div label>{{label}}</div>
  <span delim>:</span>
  <multi-select flex field options="{{options}}" selected="{{value}}" selected="{{value}}" multiple="{{multiple}}" on-change="onFieldChange"></multi-select>
</div>
`
});
