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
  }));
  this.updatePanels(state);
  return this.updateSelected(selected, state);
},
updatePanels(state) {
  state.tabs?.forEach((t,i) => t.value = i);
  state.panels = state.tabs?.map((t,i) => ({
    name: 'Container' + (i===0 ? '' : i+1)
  }));
},
updateSelected(value, state) {
  const selected = Number(value) || 0;
  if (state.selected !== selected) {
    state.selected = selected;
    return {selected};
  }
},
onChange({eventlet: {value}}, state) {
  return this.updateSelected(value, state);
},
onClose({eventlet: {value}}, state) {
  const index = Number(value);
  state.tabs.splice(index, 1);
  this.updatePanels(state);
  if (state.selected >= index) {
    this.updateSelected(state.selected-1, state);
  }
},
template: html`
<style>
  :host {
    /* padding: 0 8px; */
  }
  spectrum-tab-panels {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
  }
</style>
<spectrum-tab-panels size="m" closeable="{{closeable}}" selected="{{selected}}" tabs="{{tabs}}" on-change="onChange" on-close="onClose" repeat="slot_t">
  <slot name="Container"></slot>
</spectrum-tab-panels>

<!-- <template slot_t>
    <div flex scrolling column panel slot="{{name}}">
    <slot name="{{name}}"></slot>
  </div>
</template> -->
`
});
