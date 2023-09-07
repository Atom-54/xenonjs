export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({image, url}, state, {isDirty}) {
  if (isDirty('url')) {
    return {image: {url}};
  }
  if (image && isDirty('image')) {
    return {image};
  }
},

onImage({eventlet: {value}}) {
  return {
    image: {url: value}
  };
},

template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
  }
  [bar] > * {
    padding: 0 10px;
  }
  input {
    max-width: 500px;
  }
</style>

<div bar>
  <span>Enter image url:</span>
  <input flex x5 type="text" on-change="onImage">
  <span flex>or</span>
  <image-upload on-image="onImage" accept="image/*">
    <button>Upload</button>
  </image-upload>
</div>

`
});
