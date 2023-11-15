export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({form, value}, state, {service, isDirty}) {
  service('FormService', 'RegisterField', {form});
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
  }
  [label] {
    font-size: .75em;
    margin-bottom: .3em;
  }
  [field] {
    --multi-select-color: var(--xcolor-two);
  }
</style>

<div label>{{label}}</div>
<div flex bar>
  <multi-select field flex options="{{options}}" selected="{{value}}" multiple="{{multiple}}" on-change="onFieldChange"></multi-select>
</div>
`
});
