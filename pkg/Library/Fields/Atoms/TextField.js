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
    } else {
      state.options = options;
    }
  }
  if (isDirty('value')) {
    state.value = value;
    return {value};
  }
},
render({label, placeholder, disabled}, {value, options}) {
  return {
    label,
    value: value??'',
    placeholder: placeholder??'',
    disabled: Boolean(disabled),
    options: options?.map(option => ({option}))
  }
},
onFieldChange({eventlet: {value}}, state, {output}) {
  state.value = value;
  this.debounce(state, 1000, () => {
    output({value: state.value});
  });
  //return {value};
},
debounce(state, delay, action, key="change") {
  const timer = (state.keys ??= {})[key];
  if (timer >= 0) {
    clearTimeout(timer);
  }
  if (action && delay) {
    state.keys[key] = setTimeout(() => {
      delete state.keys[key];
      action();
    }, delay);
  }
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
  <input flex field value="{{value}}" placeholder="{{placeholder}}" disabled="{{disabled}}" on-input="onFieldChange" xon-change="onFieldChange" list="options">
  <datalist id="options" repeat="option_t">{{options}}</datalist>
</div>

<template option_t>
  <option value="{{option}}">
</template>
`
});
