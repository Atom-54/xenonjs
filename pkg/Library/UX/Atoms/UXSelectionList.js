export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({list, selection}, state) {
  state.selection = selection ?? {};
},
onChange({eventlet: {key, value}}, {selection}) {
  selection[key] = !selection[key];
  return {selection};
},
render({list}, {selection}) {
  list = list || ['Alpha', 'Beta', 'Delta', 'Gamma'];
  const items = list.map(key => ({key, checked: selection[key], label: key}));
  return {items};
},
template: html`
<style>
  :host {
    --checkbox-size: 1.2em;
    overflow: auto !important;
  }
  [control] {
    margin-bottom: 0.5em;
  }
</style>
<div flex column repeat="check_t">{{items}}</div>
<template check_t>
  <label control row>
    <wl-checkbox on-click="squelch" key$="{{key}}" checked$="{{checked}}" on-change="onChange"></wl-checkbox>
    &nbsp;&nbsp;
    <span>{{label}}</span>
  </label>
</template>
`
});
