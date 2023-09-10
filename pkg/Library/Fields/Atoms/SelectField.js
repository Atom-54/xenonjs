export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({form, value}, state, {service, isDirty}) {
  service('FormService', 'registerField', {form});
  if (isDirty('value')) {
    return {value};
  }
},
render({label, value, multiple, options}) {
  return {
    label: label ?? '',
    value,
    multiple,
    options
  };
},
onFieldChange({eventlet: {value}}, state) {
  return {value};
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
    border: none;
    text-align: right;
    min-width: var(--field-label-width);
  }
  [delim] {
    padding-right: 12px;
  }
</style>

<div flex bar>
  <div label>{{label}}</div>
  <span delim></span>
  <multi-select flex options="{{options}}" selected="{{value}}" selected="{{value}}" multiple="{{multiple}}" on-change="onFieldChange"></multi-select>
</div>
`
});
