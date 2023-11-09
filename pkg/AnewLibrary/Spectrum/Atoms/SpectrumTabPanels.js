export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({tabs, selected}, state) {
  state.tabs = tabs?.map((t, i) => ({
    label: t,
    value: i
  }))
  state.panels = tabs?.map((t,i) => ({
    name: 'Container' + (i===0 ? '' : i+1)
  }));
  return {selected: Number(selected) || 0};
},
onChange({eventlet: {value}}) {
  return {selected: Number(value)};
},
template: html`
<style>
  :host {
    padding: 0 8px;
  }
  spectrum-tab-panels {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
  }
</style>
<spectrum-tab-panels size="m" selected="{{selected}}" tabs="{{tabs}}" on-change="onChange" repeat="slot_t">{{panels}}</spectrum-tab-panels>
<template slot_t>
  <div flex scrolling column panel slot="{{name}}">
    <slot name="{{name}}"></slot>
  </div>
</template>
`
});
