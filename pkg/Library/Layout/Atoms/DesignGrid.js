export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
template: html`
<style>
  :host {
    overflow: auto !important;
  }
  design-grid {
    width: 100%;
    height: 100%;
  }
</style>
<design-grid items="{{items}}"></design-grid>
`
});
