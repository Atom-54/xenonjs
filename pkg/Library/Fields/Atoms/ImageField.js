export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({form, image, value}, state, {isDirty, service}) {
  service('FormService', 'RegisterField', {form});
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
    padding: 0 6px;
  }
  [label] {
    font-size: .75em;
    margin-bottom: .3em;
  }
  [field] {
    padding: 6px 9px;
    border-radius: 4px;
    border: 1px solid var(--xcolor-two);
  }
  [delim] {
    padding: 6px;
  }
  image-upload {
    display: flex;
    align-items: center;
  }
</style>

<div label>{{label}}</div>
<div flex bar>
  <div flex row> 
    <input flex field type="text" on-change="onImage">
    <span delim>or</span>
    <image-upload on-image="onImage" accept="image/*">
      <wl-button inverted>Upload</wl-button>
    </image-upload>
  </div>
</div>

`
});
