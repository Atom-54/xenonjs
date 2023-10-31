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
    /* display: none; */
  }
</style>
<pixi-sprite app="{{app}}" from="{{from}}" x="{{x}}" y="{{y}}" r="{{r}}" s="{{s}}" z="{{z}}"></pixi-sprite>
`
})