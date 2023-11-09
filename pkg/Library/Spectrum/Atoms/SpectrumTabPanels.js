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
  if (!selected) selected = 0;
  return {selected};
},
onChange({eventlet: {value}}) {
  return {selected: value};
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
<spectrum-tab-panels size="m" selected="{{selected}}" tabs="{{tabs}}" on-change="onChange">
  <slot name="Container" slot="Container"></slot>
  <slot name="Container2" slot="Container2"></slot>
  <slot name="Container3" slot="Container3"></slot>
  <slot name="Container4" slot="Container4"></slot>
  <slot name="Container5" slot="Container5"></slot>
  <slot name="Container6" slot="Container6"></slot>
  <slot name="Container7" slot="Container7"></slot>
  <slot name="Container8" slot="Container8"></slot>
  <slot name="Container9" slot="Container9"></slot>
  <slot name="Container10" slot="Container10"></slot>
</spectrum-tab-panels>
`
});
