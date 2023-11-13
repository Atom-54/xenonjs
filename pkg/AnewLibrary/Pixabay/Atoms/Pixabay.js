export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({query, index}, state, {isDirty}) {
  if (query) {
    state.image = await this.requestImage(query, index);
    return {image: state.image};
  }
},
async requestImage(query, index) {
  const server = `https://openai.iamthearchitect.workers.dev/pixabay/?query=`;
  const response = await fetch(`${server}${query}`, {method: 'GET'});
  const json = await response.json();
  log(json);
  const hits = json?.hits;
  const hit = hits?.[index > 0 ? index : 0];
  return {...this.hitToImage(hit, {}), hits};
},
hitToImage(hit, image) {
  const url = hit?.webformatURL;
  const name = hit?.previewURL?.split('/').pop();
  return {
    ...image,
    version: Math.random(),
    canvas: null,
    name,
    url
  };
},
onCanvas({eventlet: {value}}, state) {
  if (state.image?.url === value?.url) {
    const image = state.image = {...state.image, canvas: value.canvas, version: Math.random()};
    return {image};
  }
},
onPrevClick(inputs, state) {
  const image = state.image = this.walkImage(-1, state);
  return {image};
},
onNextClick(inputs, state) {
  const image = state.image = this.walkImage(1, state);
  return {image};
},
walkImage(delta, {image}) {
  if (image) {
    const hit = this.walkHits(image, delta);
    const url = hit?.webformatURL;
    const name = hit?.previewURL.split('/').pop();
    return {
      ...image,
      version: Math.random(),
      canvas: null,
      name,
      url
    };
  }
},
walkHits({hits, url}, delta) {
  if (hits) {
    const current = hits.findIndex(({webformatURL}) => webformatURL === url);
    const index = ((current ?? 0) + delta + hits.length) % hits.length;
    return hits[index];
  }
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
  }
  image-resource {
    background: transparent;
  }
</style>
<div toolbar><icon on-click="onPrevClick">arrow_circle_left</icon><icon on-click="onNextClick">arrow_circle_right</icon></div>
<!-- TODO: use an Image atom instead -->
<image-resource flex image="{{image}}" on-canvas="onCanvas"></image-resource>
`
});
