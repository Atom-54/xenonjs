export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// onClick({eventlet: {value}}) {
//   return {value: Math.random()};
// },
template: html`
<sp-action-menu repeat="item_t">{{items}}</sp-action-menu>
<template item_t>
  <sp-menu-item>{{label}}</sp-menu-item>
</template>
<!--
<sp-action-menu>
  <sp-menu-item>Deselect</sp-menu-item>
  <sp-menu-item>Select Inverse</sp-menu-item>
  <sp-menu-item>Feather...</sp-menu-item>
  <sp-menu-item>Select and Mask...</sp-menu-item>
  <sp-menu-divider></sp-menu-divider>
  <sp-menu-item>Save Selection</sp-menu-item>
  <sp-menu-item disabled>Make Work Path</sp-menu-item>
</sp-action-menu>
-->
`
});
