export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
onAppId({eventlet: {value: app}}) {
  return {app};
},
onCanvas({eventlet: {value}}) {
  return {frame: {canvas: value}};
},
template: html`
<style>
  :host {
    display: flex;
  }
  [objects] {
    position: absolute;
  }
</style>
<pixi-app flex active="{{active}}" on-appid="onAppId" on-canvas="onCanvas"></pixi-app>
<div objects>
  <slot name="Container"></slot>
</div>
`
})