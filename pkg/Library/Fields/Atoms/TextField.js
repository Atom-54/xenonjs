export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value, form}, state, {service, isDirty}) {
  service('FormService', 'registerField', {form});
  if (isDirty('value')) {
    state.value = value;
    return {value};
  }
},
render({label, options}, {value}) {
  return {
    label,
    value: value??'',
    options: options?.map(option => ({option}))
  }
},
onFieldChange({eventlet: {value}}, state) {
  state.value = value;
  return {value};
},
template: html`
<style>
  :host {
    padding: 0 6px;
    height: 2em;
  }
  [label] {
    background: inherit;
    border: none;    
    max-width: var(--field-label-max-width);
    text-wrap: pretty;
  }
  [field] {
    padding: 6px 9px;
    border-radius: 4px;
    border: 1px solid var(--xcolor-two);
  }
  [delim] {
    padding: 6px;
  }
</style>

<div flex bar>
  <div label>{{label}}</div>
  <span delim></span>
  <input flex field value="{{value}}" on-change="onFieldChange" list="options">
  <datalist id="options" repeat="option_t">{{options}}</datalist>
</div>

<template option_t>
  <option value="{{option}}">
</template>
`
});
