export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update(inputs) {
  log(inputs);
},
template: html`
<style>
  :host {
    display: none;
  }
</style>
<pixi-nu-pogodi app="{{app}}"></pixi-nu-pogodi>
`
})