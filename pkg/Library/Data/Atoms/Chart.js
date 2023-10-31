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
</style>

<div>
  <chart-js type="{{type}}" data="{{data}}" options="{{options}}"></chart-js>
</div>

`

});
