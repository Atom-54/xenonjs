export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({tabs, selected}, state) {
  state.tabs = tabs?.map((t, i) => ({label: t, value: i}));
  return this.updateSelected(selected, state);
},
updateSelected(value, state) {
  const selected = Number(value) || 0;
  if (state.selected !== selected) {
    state.selected = selected;
    return {selected};
  }
  return {};
},
onChange({eventlet: {value}}, state) {
  return this.updateSelected(value, state);
},
onClose({eventlet: {value}, tabs}, state) {
  const index = Number(value);
  state.tabs.splice(index, 1);
  state.tabs?.forEach((t,i) => t.value = i);
  tabs.splice(index, 1);
  let selected = this.updateSelected(Math.min(index, state.selected-1), state);
  return {...selected, tabs};
},
template: html`
<style>
  spectrum-tab-panels {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
  }
</style>
<spectrum-tab-panels size="m" closeable="{{closeable}}" selected="{{selected}}" tabs="{{tabs}}" on-change="onChange" on-close="onClose" repeat="slot_t">
  <slot name="Container"></slot>
</spectrum-tab-panels>
`
});
