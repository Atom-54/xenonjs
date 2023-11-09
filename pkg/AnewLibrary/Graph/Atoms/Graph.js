export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({graphId}, state, {isDirty, service}) {
  if (isDirty('graphId')) {
    await service('LayerService', 'CreateLayer', {id: graphId});
    log('LayerService::CreateLayer completed for', graphId);
  }
},
template: html`
<slot name="Container"></slot>
`
});
  