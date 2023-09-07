export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.layer = await service('GraphService', 'CreateLayer');
},
async update({}, state, {service}) {
},
template: html`
<style>
  :host {
  }
</style>
<div>Layer <span>{{layer}}</span> me Bro</div>
`
});