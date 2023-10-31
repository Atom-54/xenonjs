export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({html, style}) {
  if (html && (typeof html !== 'string')) {
    html = JSON.stringify(html, null, '  ');
  }
  return {html, style};
},
template: html`
<style>
:host {
  overflow: auto !important;
}
</style>
<div xen:style="{{style}}" unsafe-html="{{html}}"></div>
`
});
