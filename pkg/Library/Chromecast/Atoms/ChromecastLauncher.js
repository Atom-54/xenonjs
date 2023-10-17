export const atom = log => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(_, state, {service, output}) {
  this.initComposer(state, {service, output});
},
async initComposer(state, {service, output}) {
  state.composerId = await service('ChromecastService', 'GetComposerId');
  output({composer: state.composerId});
},
template: html`
<google-cast-launcher></google-cast-launcher>
`
});
