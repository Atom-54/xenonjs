export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldRender({tabs}) {
  return tabs;
},
render({tabs}) {
  return {
    tabs: tabs.join(',')
  };
},
onPageSelected() {
  //
},
template: html`
<weightless-pages flex on-selected="onPageSelected" tabs="{{tabs}}">
  <slot name="pageContainer"></slot>
</weightless-pages>
  <!-- tabs -->
  <!-- <wl-tab-group selectedtab="stores" on-change="onTabChange" repeat="tab_t">{{tabs}}</wl-tab-group>
  <template tab_t>
    <wl-tab key="{{key}}">{{label}}</wl-tab>
  </template> -->

  <!-- Pages -->
  <!-- <mxc-tab-pages dark flex selected="{{selectedTab}}" tabs="Stores,Atoms,Resources,DOM,Graphs,Charts,Tests" on-selected="onTabSelected">
    <slot name="pageContainer">
  </mxctab-pages> -->
`
});
