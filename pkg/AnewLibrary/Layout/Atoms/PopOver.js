export const atom = (log, resolve) => ({
  /**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({show}, state, {service}) {
  if (show === true) {
    state.show = true;
    this.refresh(state, service);
  }
},
async refresh(state, service) {
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
    /* --xcolor-hi-one: hsl(292deg 83% 31%);
    --xcolor-hi-two: hsl(292deg 83% 71%);
    font-family: 'Google Sans', sans-serif;
    font-size: 12px; */
  }
  [poptover] {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 50%;
    min-width: min(320px, 100vw);
    max-width: min(100vw, 800px);
    z-index: 110100;
    transform: translateX(-120%);
    transition: transform 200ms ease-in;
    box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
    background: white;
    /* 
    color: lightblue;
    background: #333; 
    */
  }
  [poptover][show] {
    transform: translateX(0);
  }
</style>

<!-- popover flyout -->
<div poptover flex rows show$="{{show}}" on-click="onTogglePopoverClick">
  <div style="padding: 12px 8px;">PopOver</div>
  <slot name="Container"></slot>
</div>
`
});
