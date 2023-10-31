export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({tabs}, state) {
  state.tabs = tabs?.map((t, i) => ({
    label: t,
    value: i
  }))
},
onChange({eventlet: {value}}) {
  return {tab: value};
},
template: html`
<style>
  :host {
    padding: 0 8px;
  }
  spectrum-tab-panels {
    display: block;
  }
</style>
<spectrum-tab-panels size="m" selected="{{selected}}" tabs="{{tabs}}" on-change="onChange">
  <slot name="Container" slot="Container"></slot>
  <slot name="Container1" slot="Container1"></slot>
  <slot name="Container2"></slot>
  <slot name="Container3"></slot>
  <slot name="Container4"></slot>
  <slot name="Container5"></slot>
  <slot name="Container6"></slot>
  <slot name="Container7"></slot>
  <slot name="Container8"></slot>
  <slot name="Container9"></slot>
  <slot name="Container10"></slot>
</spectrum-tab-panels>
`
});
