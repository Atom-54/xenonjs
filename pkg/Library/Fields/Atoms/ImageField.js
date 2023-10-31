export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({form, image, value}, state, {isDirty, service}) {
  service('FormService', 'registerField', {form});
  if (isDirty('value')) {
    return {image: {url: value}, value};
  }
  if (image && isDirty('image')) {
    return {image, value};
  }
},

onImage({eventlet: {value}}) {
  return {
    image: {url: value},
    value
  };
},

template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
  }
  [bar] > * {
    padding: 0 4px;
  }
  input {
    min-width: 120px;
    max-width: 500px;
  }
</style>

<div bar>
  <span>Image url:</span>
  <input flex type="text" on-change="onImage">
  <span>or</span>
  <image-upload on-image="onImage" accept="image/*">
    <button>Upload</button>
  </image-upload>
</div>

`
});
