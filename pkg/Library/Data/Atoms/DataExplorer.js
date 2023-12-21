export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({object, expandLevel}, state, {service}) {
  state.object = object ?? state.object ?? {};
  state.expandLevel = expandLevel >= 0 ? expandLevel : 2;
},
onStateChange({eventlet}, state) {
  state.object = eventlet ?? {};
},
template: html`
<data-explorer flex object="{{object}}" expand="{{expandLevel}}"></data-explorer>
`
});
