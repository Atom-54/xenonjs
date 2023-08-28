export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({layout, selected}, state, {service, isDirty}) {
  // we have to test here to avoid spurious updates due to 
  // `selected` changing when layout is not
  // normally we just accept the extra updates, 
  // but this seemed like a better tradeoff here
  if (isDirty('layout')) {
  //if (!deepEqual(state.layout, layout)) {
    this.cacheLayout(state, service, layout);
    return {layout};
  }
  if (state.selected !== selected) {
    return this.select(selected, state);
  }
},
onSelect({eventlet: {value}, layout}, state) {
  return this.select(value, state);
},
select(selected, state) {
  state.selected = selected;
  return {selected};
},
async onLayout({eventlet: {value: layout}}, state, {service}) {
  this.cacheLayout(state, service, layout);
  return {layout};
},
async onContain({eventlet}, state, {service}) {
  await service({kind: 'GraphService', msg: 'Contain', data: eventlet});
},
cacheLayout(state, service, layout) {
  state.layout = layout;
  // layout may be need to be monitored by the DesignService
  //service({kind: 'DesignService', msg: 'Layout', data: {layout}});
},
template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    min-height: 64px;
    min-width: 64px;
    flex: 1 !important;
    border-style: solid;
    color: var(--xcolor-four);
    background-color: var(--xcolor-one);
    position: relative;
  }
  designer-panel {
    background-image: radial-gradient(var(--xcolor-two) 15%, transparent 15%) !important;
    background-position: -8px -8px, 0 0;
    background-size: 16px 16px;
  }
  designer-panel[readonly] {
    background-image: none !important;
    background-color: transparent !important;
  }
  [name="Container"]::slotted(*) {
    flex: 1 !important;
  }
  [name="ToolbarContainer"] {
    z-index: 1000;
  }
</style>
<designer-panel flex column 
    readonly$="{{disabled}}" 
    layout="{{layout}}" 
    selected="{{selected}}" 
    color="{{color}}" 
    on-select="onSelect" 
    on-layout="onLayout" 
    on-contain="onContain">
  <slot name="ToolbarContainer" slot="toolbar"></slot>
  <slot name="Container"></slot>
</designer-panel>
`
});
