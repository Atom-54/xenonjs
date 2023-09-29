export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

onFile({eventlet: {key: title, value: content}}) {
  return {title, content};
},

template: html`
<style>
  :host {
    padding: 0 6px;
    height: 2em;
  }
  [delim] {
    width: 15px;
  }
</style>

<div flex bar>
  <div label>{{label}}</div>
  <span delim></span>
  <file-upload on-file="onFile" accept="{{accept}}">
    <wl-button inverted>{{button}}</wl-button>
  </file-upload>
</div>

<template option_t>
  <option value="{{option}}">
</template>
`

});  