export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({text, textStyle}) {
  if (text && !(typeof text === 'string')) {
    text = JSON.stringify(text, null, '  ');
  }
  return {
    text,
    textStyle
  };
},
template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
  }
  pre {
    margin: 0; 
    font-size: 0.75em;
    font-family: sans-serif;
    text-wrap: wrap;
  }
</style>
<pre xen:style="{{textStyle}}">{{text}}</pre>
`
});
