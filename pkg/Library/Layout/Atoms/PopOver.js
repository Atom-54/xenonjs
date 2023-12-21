export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({show, hide}, state, {isDirty}) {
  if (isDirty('show') && show) {
    state.show = true;
  } else if (isDirty('hide') && hide) {
    state.show = false;
  }
},
render({}, {show, kick}) {
  return {
    kick,
    show
  };
},
async onTogglePopoverClick(inputs, state, {service}) {
  if (state.show = !state.show) {
    await this.refresh(state, service);
  }
},
template: html`
<style>
  :host {
    position: absolute;
    flex: 0 !important;
  }
  [popnover] {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 35%;
    min-width: min(320px, 100vw);
    max-width: min(100vw, 800px);
    z-index: 110100;
    transform: translateX(-120%);
    transition: transform 200ms ease-in;
    box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
    background: white;
  }
  [popnover][show] {
    transform: translateX(0);
  }
</style>

<div popnover flex rows show$="{{show}}" on-click="onTogglePopoverClick">
  <div style="cursor: pointer; padding: 12px 8px;">X</div>
  <slot name="Container"></slot>
</div>
`
});
