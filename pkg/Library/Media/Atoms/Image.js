export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({image}, state) {
  state.image = image;
  return {image};
},
render({selfie}, {image}) {
  if (image?.url) {
    image.url = resolve(image?.url);
  }
  return {
    selfie,
    image
  };
},
onCanvas({eventlet: {value}}, state) {
  if (state.image?.url === value?.url) {
    state.image = {...value, version: Math.random()};
    return {image: state.image};
  }
},
template: html`
<style>
  :host {
    flex-direction: column;
  }
  image-resource {
    background: transparent;
    /* background: purple; */
  }
  image-resource[selfie] {
    transform: scale(-1, 1);
  }
</style>
<image-resource selfie$="{{selfie}}" flex image="{{image}}" on-canvas="onCanvas"></image-resource>
`
});
