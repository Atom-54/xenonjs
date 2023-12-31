export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  template: html`
<style>
  :host {
    display: block;
    position: absolute;
    inset: 0
    /* display: block;
    position: absolute !important; */
    /* pointer-events: none; */
  }
</style>
<pixi-sprite-grid flex app="{{app}}" bundle="{{bundle}}" cols="{{cols}}" rows="{{rows}}" size="{{size}}" margin="{{margin}}" s="{{s}}" z="{{z}}"></pixi-sprite-grid>
  `
  })