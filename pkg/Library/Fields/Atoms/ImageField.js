export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
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
