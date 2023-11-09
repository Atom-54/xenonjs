export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
template: html`
<style>
:host {
  display: flex;
}
chart-js {
  display: block;
}
</style>
<chart-js flex type="{{type}}" data="{{data}}" options="{{options}}"></chart-js>
`
});
