export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({show}) {
  return {selected: null};
},
onMenuSelect({eventlet: {value}}) {
  return {selected: value};
},
render({items, show, target}) {
  return {
    items,
    show,
    x: target?.x || 0,
    y: target?.y || 0
  };
},
template: html`
<style>
  :host {
    position: absolute;
    width: 0 !important;
    height: 0 !important;
  }
</style>
<pop-up show="{{show}}" x="{{x}}" y="{{y}}" items="{{items}}" on-menu-select="onMenuSelect"></pop-up>
`
});
