export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value}, state) {
  if (typeof value === 'string') {
    value = value.split(',').map(s => s?.trim?.());
  }
  return this.returnValue(value, state);
},
returnValue(value, state) {
  if (state.value !== value) {
    // important for renderer too
    state.value = value;
    return {value, json: JSON.stringify(value)};
  }
},
// onFieldBlur({eventlet: {value}}) {
//   //state.value = value;
//   return {value};
// },
onTagsChange({eventlet: {value}}, state) {
  return this.returnValue(value, state);
},
template: html`
<style>
  * {
    box-sizing: border-box;
  }
  :host {
    padding: 0 6px;
  }
  [label] {
    background: inherit;
    font-weight: bold;
    font-size: 75%;
    border: none;
    text-align: right;
    min-width: var(--field-label-width);
  }
  [field] {
    box-sizing: border-box;
    padding: 6px 9px;
    border-radius: 4px;
    border: 1px solid var(--xcolor-two);
    overflow-x: auto;
  }
  [delim] {
    padding: 6px;
  }
</style>
<div flex bar>
  <div label>{{label}}</div>
  <span delim></span>
  <tag-field flex field tags="{{value}}" on-tags-change="onTagsChange"></tag-field>
</div>
`
});
  