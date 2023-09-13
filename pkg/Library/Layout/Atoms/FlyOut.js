export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({show, side}) {
  return {
    show: Boolean(show),
    side
  };
},
async onToggleFlyOutClick() {
  return {show: false};
},
template: html`
<style>
  :host {
    position: absolute;
    flex: 0 !important;
    max-width: 0;
    max-height: 0;
  }
</style>

<fly-out show="{{show}}" side="{{side}}" on-toggle="onToggleFlyOutClick">
  <slot name="Container" slot="flyout"></slot>
</fly-out>
`
});
