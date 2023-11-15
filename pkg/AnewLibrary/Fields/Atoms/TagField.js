export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value, form}, state, {service}) {
  service('FormService', 'RegisterField', {form});
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
onTagsChange({eventlet: {value}}, state) {
  return this.returnValue(value, state);
},
template: html`
<style>
  * {
    box-sizing: border-box;
  }
  [label] {
    font-size: .75em;
    margin-bottom: .3em;
  }
  [field] {
    box-sizing: border-box;
    padding: 2px 0;
    border-radius: 4px;
    border: 1px solid var(--xcolor-two); 
    overflow-x: auto;
  }
</style>
<div label>{{label}}</div>
<div flex bar>
  <tag-field flex field tags="{{value}}" on-tags-change="onTagsChange"></tag-field>
</div>
`
});
  