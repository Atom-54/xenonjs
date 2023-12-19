export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value, form}, state, {service, isDirty}) {
  service('FormService', 'RegisterField', {form});
  //if (isDirty('value')) {
    value = value?.replace(/ /g, '_');
    state.value = value;
    return {value};
  //}
},
render({label, options}, {value}) {
  return {
    label,
    ligature: value ?? 'help',
    value: value ?? '',
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
  }
  [label] {
    font-size: .75em;
    margin-bottom: .3em;
  }
  [field] {
    padding: 6px 9px;
    border-radius: 4px;
    border: 1px solid var(--xcolor-two);
  }
  [delim] {
    padding: 4px;
  }
  icon {
    border: 1px solid var(--xcolor-two);
    padding: 2px;
    font-size: 150%;
  }
</style>

<div label>{{label}}</div>
<div flex bar>
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
