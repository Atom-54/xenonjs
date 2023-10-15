export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldRender({tabs}) {
  return tabs;
},
render({tabs}, {selectedTab}) {
  return {
    tabs: tabs.join(','),
    selectedTab
  };
},
onPageSelected({eventlet: {value}}, state) {
  state.selectedTab = value;
},
template: html`
<weightless-pages flex tabs="{{tabs}}" selected="{{selectedTab}}" on-selected="onPageSelected">
  <slot name="pageContainer"></slot>
</weightless-pages>
`
});
