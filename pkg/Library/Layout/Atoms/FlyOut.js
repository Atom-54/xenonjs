export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async onToggleFlyOutClick() {
  return {show: false};
},
template: html`
<style>
  :host {
    position: absolute;
    flex: 0 !important;
  }
</style>

<fly-out show="{{show}}" side="{{side}}" on-toggle="onToggleFlyOutClick">
  <slot name="Container" slot="flyout"></slot>
</fly-out>
`
});
