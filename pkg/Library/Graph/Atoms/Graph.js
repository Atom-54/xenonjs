export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({graphId}, state, {isDirty, service}) {
  const id = graphId?.meta?.id || graphId;
  if (state.graphId !== id) {
    state.graphId = id;
    await service('LayerService', 'CreateLayer', {id: graphId});
    log('LayerService::CreateLayer', id);
  }
},
template: html`
<slot name="Container"></slot>
`
});
  