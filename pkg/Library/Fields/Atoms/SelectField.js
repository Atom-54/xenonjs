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
    border: none;
    min-width: var(--field-label-min-width);
    max-width: var(--field-label-max-width);
    text-wrap: pretty;
  }
  [delim] {
    padding-right: 12px;
  }
  [field] {
    --multi-select-color: var(--xcolor-two);
    /* --multi-select-radius: 4px; */
    /* --multi-select-padding: 8px;    */
  }
</style>

<div flex bar>
  <div label>{{label}}</div>
  <span delim></span>
  <multi-select field flex options="{{options}}" selected="{{value}}" multiple="{{multiple}}" on-change="onFieldChange"></multi-select>
</div>
`
});
