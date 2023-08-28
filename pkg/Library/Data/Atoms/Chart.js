export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

template: html`
<style>
:host {
  overflow: auto !important;
}
</style>

<div>
  <awesome-chart type="{{type}}" data="{{data}}" options="{{options}}"></awesome-chart>
</div>

`

});
