export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({}, state, tools) {
  if (!state.list) {
    this.unblockedImageLister(state, tools);
  }
},
async unblockedImageLister(state, {service, invalidate}) {
  if (!state.listing) {
    log('calling StorageService::ListImages');
    state.listing = true;
    state.list = values(await service({kind: 'StorageService', msg: 'ListImages'}));
    state.listing = false;
    log('StorageService::ListImages sent', state.list);
    invalidate();
  }
},
render(inputs, {list, listing}) {
  if (listing) {
    const blank = {url: ''}, blanks = [];
    for (let i=0; i<12; i++) blanks.push(blank);
    list = blanks;
  }
  return {list};
},
template: html`
<style>
:host {
  display: flex;
  flex-direction: column;
  padding: 4px;
}
[resource] {
  display: inline-flex;
  flex-direction: column;
  border: 1px solid #821EBD;
  margin: 4px;
  /* padding: 4px; */
  width: 124px;
}
canvas, video {
  border: 1px solid purple;
  width: 120px;
  height: 90px;
  object-fit: contain;
}
/* i {
  font-size: 0.75em;
} */
</style>

<div flex scrolling repeat="resource_t">{{list}}</div>

<template resource_t>
  <div resource>
    <!-- <b>{{typeof}}</b> -->
    <img src="{{url}}" key$="{{key}}" Xwidth="120" height="90">
    <!-- <canvas xen:style="{{canvasRatio}}" hidden$="{{notCanvas}}" key$="{{key}}" width="120" height="90"></canvas>
    <video hidden$="{{notStream}}" srcobject="{{srcObject:stream}}" playsinline autoplay muted></video> -->
    <!-- <span>{{size}}</span>-->
    <i>{{key}}</i>
  </div>
</template>
`
});
