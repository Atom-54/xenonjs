export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update(inputs, state, {output}) {
  const left = Math.floor(Math.random() * 50) + 75;
  const top = Math.floor(Math.random() * 50) + 75;
  state.selections = [{
    left,
    style: `left: ${left}px; top: 100px; width: 100px; height: 100px;`
  },{
    top,
    style: `left: 220px; top: ${top}px; width: 50px; height: 150px;`
  }]
  // setInterval(() => {
  //   let b = state.selections[0];
  //   b.left = (b.left + 4) % 400;
  //   b.style = `left: ${b.left}px; top: 100px; width: 100px; height: 100px;` ;
  //   let b1 = state.selections[1];
  //   b1.top = (b1.top + 4) % 300;
  //   b1.style = `left: 100px; top: ${b1.top}px; width: 50px; height: 150px;` ;
  //   output();
  // }, 30)
},
onTargetEnter({eventlet}, state, {service}) {
  service('DesignService', 'DesignDragEnter', {eventlet});
},
onTargetLeave({eventlet}, state, {service}) {
  service('DesignService', 'DesignDragLeave', {eventlet});
},
onTargetDrop({eventlet}, state, {service}) {
  service('DesignService', 'DesignDragDrop', {eventlet});
},
template: html`
<style>
  :host {
    position: relative;
  }
  [box] {
    pointer-events: none;
    background: transparent;
    position: absolute;
    border: 5px dotted violet;
    z-index: 1000;
  }
</style>
<drop-target flex column datatype="node/type" on-target-enter="onTargetEnter" on-target-leave="onTargetLeave" on-target-drop="onTargetDrop">
  <slot name="Container"></slot>
</data-explorer>
<div repeat="box_t">{{selections}}</div>
<template box_t>
  <div box style="{{style}}"></div>
</template>
`
});
  