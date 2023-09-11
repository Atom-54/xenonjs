export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value, form}, state, {service, isDirty}) {
  service('FormService', 'registerField', {form});
  if (isDirty('value')) {
    value = value?.replace(/ /g, '_');
    return {value};
  }
},
render({label, value, options}) {
  return {
    label,
    ligature: value ?? 'help',
    value: value ?? '',
    options: options?.map(option => ({option}))
  }
},
onFieldChange({eventlet: {value}}) {
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
    font-weight: bold;
    font-size: 75%;
    border: none;
    text-align: right;
    min-width: var(--field-label-width);
  }
  [field] {
    padding: 6px 9px;
    border-radius: 4px;
    border: 1px solid var(--xcolor-two);
  }
  [delim] {
    padding: 6px;
  }
  icon {
    border: 1px solid var(--xcolor-two);
    padding: 2px;
    font-size: 150%;
  }
</style>

<div flex bar>
  <div label>{{label}}</div>
  <span delim></span>
  <icon>{{ligature}}</icon>
  <span delim></span>
  <div flex>
    <input style="width: 100%;" field value="{{value}}" on-change="onFieldChange" list="options">
    <datalist id="options" repeat="option_t">{{options}}</datalist>
  </div>
</div>

<template option_t>
  <option value="{{option}}">
</template>
`
});
