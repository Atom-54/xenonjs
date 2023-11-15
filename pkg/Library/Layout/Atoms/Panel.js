export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({layout, center, style}) {
  const isRow = layout === 'row';
  const rules = `:host { 
    flex-direction: ${isRow ? 'row' : 'column'} !important;
  }`;
  return {
    rules,
    style,
    isRow,
    isColumn: !isRow,
    center
  };
},
template: html`
<style>${'{{rules}}'}</style>
<slot name="Container"></slot>
`
});
