export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value, form}, state, {service}) {
  service('FormService', 'RegisterField', {form});
  state.value = value;
  return {value};
},
onValueChange({eventlet: {value}}, state) {
  // because checkboxes are eccentric
  value = !state.value;
  // this is done so the renderer can 
  // have it right away
  state.value = value;
  // output may come back eventually 
  // as input
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
  [delim] {
    padding-right: 9px;
  }
  [field] {
    margin: 0;
  }
</style>
<div label>{{label}}</div>
<div flex bar>
  <input field type="checkbox" checked="{{value}}" on-change="onValueChange">
</div>
`
});
