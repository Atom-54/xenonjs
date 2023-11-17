export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value, form, options}, state, {service, isDirty}) {
  service('FormService', 'RegisterField', {form});
  if (options && isDirty('options')) {
    if (typeof options === 'string') {
      try {
        state.options = JSON.parse(options);
      } catch (e) {}
    }
  }
  if (isDirty('value')) {
    state.value = value;
    return {value};
  }
},
render({label}, {value, options}) {
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
    padding: 6px;
  }
</style>

<div label>{{label}}</div>
<div flex bar>
  <input flex field value="{{value}}" on-input="onFieldChange" xon-change="onFieldChange" list="options">
  <datalist id="options" repeat="option_t">{{options}}</datalist>
</div>

<template option_t>
  <option value="{{option}}">
</template>
`
});
