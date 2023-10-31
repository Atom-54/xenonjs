export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({list, image}) {
  list ??= [];
  if (image) {
    const existing = list.find(i => (image.name && i.name == image.name) || (i.url === image.url));
    if (!existing) {
      log('adding', image);
      return {list: [...list, image]};
    }
  }
},
render({list}, {selected}) {
  if (!list?.length) {
    list = [{url: ''},{url: ''},{url: ''}];
  }
  selected ||= 0;
  // TODO(sjmiles): put this into Xen.Template?
  const noimg = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  list = list.map(({url, ...etc}, key) => ({...etc, url: url || noimg, key, isSelected: key === selected}));
  return {list};
},
onResourceClick({eventlet: {key}}, state) {
  state.selected = Number(key);
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
  border: 2px solid var(--xcolor-two);
  background-color: var(--xcolor-one);
  /* background-color: #472256; */
  margin: 4px;
  /* padding: 4px; */
  /* width: 124px; */
  box-sizing: border-box;
  width: 120px;
  height: 90px;
}
[resource][selected] {
  border: 2px solid var(--xcolor-four);
  background-color: #821EBD;
  color: var(--xcolor-one);
}
img {
  object-fit: contain;
}
canvas, video {
  object-fit: contain;
}
i {
  font-size: 0.6em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px;
  text-align: right; 
}
</style>

<div flex scrolling repeat="resource_t">{{list}}</div>

<template resource_t>
  <div resource selected$="{{isSelected}}" key$="{{key}}" on-click="onResourceClick">
    <img flex src="{{url}}">
    <i>{{name}}</i>
  </div>
</template>
`
});
