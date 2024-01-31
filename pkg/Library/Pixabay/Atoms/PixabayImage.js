export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({query, index}, state, {isDirty}) {
  if (isDirty('index')) {
    state.current = Number(index);
  }
  if (query && isDirty('trigger')) {
    state.images = await this.queryImages(query);
  }
  state.image = this.getImage(state.images, index);
  return {images: state.images, image: state.image};
},
async queryImages(query) {
  const server = `https://openai.iamthearchitect.workers.dev/pixabay/?q=${query}&per_page=100&image_type=photo`;
  const response = await fetch(server, {method: 'GET'});
  const images = await response.json();
  return images?.hits;
},
getImage(images, index) {
  const hit = images?.[index > 0 ? index : 0];
  return {
    version: Math.random(),
    canvas: null,
    name: hit?.previewURL?.split('/').pop(),
    url: hit?.webformatURL
  };
},
onCanvas({eventlet: {value}}, state) {
  if (state.image?.url === value?.url) {
    const image = state.image = {
      ...state.image, 
      canvas: value.canvas, 
      version: Math.random()
    };
    return {image};
  }
},
onNextClick(inputs, state) {
  return this.deltaClick(state, 1);
},
onPrevClick(inputs, state) {
  return this.deltaClick(state, -1);
},
deltaClick(state, delta) {
  if (state.images) {
    state.current = this.walkHits(state.images, state.current, delta);
    state.image = this.getImage(state.images, state.current);
    return {image: state.image};
  }
},
walkHits(images, current, delta) {
  return ((current ?? 0) + delta + images?.length) % images?.length;
},
template: html`
<style>
  :host {
    flex-direction: column;
  }
  [toolbar] {
    position: absolute;
    background: transparent;
  }
  icon {
    border-radius: 50%;
    background: black;
    text-shadow: 1px 1px 1px #f1f1f1;
    text-shadow: -1px -1px 1px #f1f1f1;
    cursor: pointer;
  }
  image-resource {
    background: transparent;
  }
</style>
<!-- TODO: factor out UX -->
<div toolbar>
  <icon on-click="onPrevClick">arrow_circle_left</icon>
  <icon on-click="onNextClick">arrow_circle_right</icon>
</div>
<image-resource flex image="{{image}}" on-canvas="onCanvas"></image-resource>
`
});
