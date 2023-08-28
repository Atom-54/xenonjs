export const atom = (log, resolve) => ({

/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({showB}, state) {
  state.showB = showB;
},
render(inputs, {showB}) {
  return {
    showA: !showB,
    showB: showB
  };
},
onCardClick(inputs, state) {
  state.showB = !state.showB;
  return {showB: state.showB};
},
template: html`
<style>
  :host {
    display: flex;
    min-width: 2em;
    min-height: 2em;
  }
  * {
    box-sizing: border-box;
  }
  :host {
    position: relative;
  }
  [card] {
    transition: all 300ms ease-out;
    transform: rotate3d(0, 1, 0, 0);
  }
  [a] > [name=Container2]::slotted(*) {
    display: none !important;
  } 
  [b] {
    transform: rotate3d(0, 1, 0, 180deg) scaleX(-1);
  }
  [b] > [name=Container]::slotted(*) {
    display: none !important;
  }
  [flip] {
    position: absolute;
    right: 8px;
    top: 8px;
    z-index: 1;
    opacity: 0.5;
    /* padding: 9px; */
  }
  [flip] icon {
    font-size: 20px;
  }
  [flip]:hover {
    opacity: 1;
    background-color: var(--theme-color-bg-0);
    border-radius: 50px;
  }
</style>
<div flip on-click="onCardClick"><icon>360</icon></div>
<div flex column>
  <div flex row card a$="{{showA}}" b$="{{showB}}" on-click="onCardClick">
    <slot name="Container" on-click="dontPropagate"></slot>
    <slot name="Container2" on-click="dontPropagate"></slot>
  </div>
</div>
`
});
