export const atom = (log, resolve) => ({

/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({tabs}) {
  return {
    tabs
  };
},
template: html`
 <!-- tabbed pages -->
  <wl-tab-group selectedtab="stores" on-change="onTabChange" repeat="tab_t">{{tabs}}</wl-tab-group>
  <mxc-tab-pages dark flex selected="{{selectedTab}}" tabs="Stores,Atoms,Resources,DOM,Graphs,Charts,Tests" on-selected="onTabSelected">
  <template tab_t>
    <wl-tab key="{{key}}">{{label}}</wl-tab>
  </template>
`
});
