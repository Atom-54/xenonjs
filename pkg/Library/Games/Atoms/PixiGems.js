export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 NeonFlan LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  template: html`
<style>
  :host {
    display: block;
    position: absolute;
  }
</style>
<pixi-sprite-grid app="{{app}}"></pixi-sprite-grid>
  `
  })