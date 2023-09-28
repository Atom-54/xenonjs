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
`
});
