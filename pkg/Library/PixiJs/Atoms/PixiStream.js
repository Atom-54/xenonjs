export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
template: html`
<style>
  :host {
    display: none;
  }
</style>
<pixi-stream app="{{app}}" stream="{{stream}}"></pixi-stream>
`
})