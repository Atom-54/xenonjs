export const atom = (log, resolve) => ({

/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({divider}, state) {
  if (divider !== state.divider) {
    state.divider = divider;
    return {divider};
  }
},
render({layout, style, endflex, collapsed}, {divider}) {
  const row = (layout === 'row') || (layout === 'vertical');
  return {
    style,
    row,
    column: !row,
    endflex,
    divider,
    collapsed
  };
},
onDividerChange({eventlet: {value}}, state) {
  state.divider = value;
  return {divider: value};
},
template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    flex: 1 !important;
    min-width: 16px;
    min-height: 16px;
  }
  :host slot::slotted(*) {
    transform: none !important;
    width: auto !important;
    height: auto !important;
    left: 0 !important;
    top: 0 !important;
  }
</style>
<split-panel flex 
  xen:style="{{style}}" 
  row$="{{row}}" 
  column$="{{column}}" 
  vertical="{{row}}" 
  endflex="{{endflex}}" 
  divider="{{divider}}"
  collapsed="{{collapsed}}"
  on-divider-change="onDividerChange"
>
  <slot name="Container" slot="one"></slot>
  <slot name="Container2" slot="two"></slot>
</split-panel>
`
});
