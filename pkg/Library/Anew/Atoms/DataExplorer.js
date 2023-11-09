export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({object, expandLevel}, state, {service}) {
  state.object = object ?? {
    text: 'Hello World'
  };
  state.expandLevel = expandLevel >= 0 ? expandLevel : 2;
},
template: html`
<data-explorer flex object="{{object}}" expand="{{expandLevel}}"></data-explorer>
`
});
