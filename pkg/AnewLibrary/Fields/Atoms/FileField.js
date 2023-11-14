export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

onFile({eventlet: {key: title, value: content}}) {
  return {title, content};
},

template: html`
<style>
  [label] {
    font-size: .75em;
  }
  [bar] {
    margin: .3em 0;
  }
  [delim] {
    padding: 6px;
  }
</style>

<div label>{{label}}</div>
<div flex bar>
  <file-upload on-file="onFile" accept="{{accept}}">
    <wl-button inverted>{{button}}</wl-button>
  </file-upload>
</div>

<template option_t>
  <option value="{{option}}">
</template>
`

});  