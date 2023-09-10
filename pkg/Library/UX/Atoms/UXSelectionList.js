export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({list, selection}) {
},
render({list, selection}, state) {
  list = list || ['Alpha', 'Beta', 'Delta', 'Gamma'];
  const items = list.map(key => ({key, checked: false, label: key}));
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
    <wl-checkbox on-click="onFoo" Xkey$="{{key}}" Xchecked="{{checked}}"></wl-checkbox>
    &nbsp;&nbsp;
    <span>{{label}}</span>
  </label>
</template>
`
});
