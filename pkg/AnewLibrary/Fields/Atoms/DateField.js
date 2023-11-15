export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value, form}, state, {service, isDirty}) {
  service('FormService', 'registerField', {form});
  if (isDirty('value')) {
    let textValue = new Date(value).toLocaleString();
    if (textValue === 'Invalid Date') {
      value = Date.now();
      textValue = new Date(value).toLocaleString();
    }
    state.textValue = textValue;
    state.value = value;
    return {value};
  }
},
render({label, options}, {textValue}) {
  return {
    label,
    value: textValue??'',
    options: options?.map(option => ({option}))
  }
},
onFieldChange({eventlet: {value: textValue}}, state) {
  state.textValue = textValue;
  let value = Date.parse(textValue);
  if (isNaN(value)) {
    value = Date.now();
    state.textValue = new Date(value).toLocaleString();
  }
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
</style>

<div label>{{label}}</div>
<div flex bar>
  <input flex field value="{{value}}" on-change="onFieldChange" list="options">
  <datalist id="options" repeat="option_t">{{options}}</datalist>
</div>

<template option_t>
  <option value="{{option}}">
</template>
`
});
