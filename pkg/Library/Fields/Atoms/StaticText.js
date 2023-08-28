export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
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
  }
</style>
<div scrolling flex column>
  <pre xen:style="{{textStyle}}">{{text}}</pre>
</div>
`
});
