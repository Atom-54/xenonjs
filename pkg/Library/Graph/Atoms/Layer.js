export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({graph, data}, state, {service, isDirty}) {
  if (isDirty('data')) {
    return {data};
  }
  if (isDirty('graph')) {
    if (state.layerId) {
      //await service('GraphService', 'DestroyLayer', {layerId});
    }
    if (graph && !state.layerId) {
      const layerId = state.layerId = await service('GraphService', 'CreateLayer', {graph});
      await service('GraphService', 'CreateLayerBinding', {layerId});
      const io = await service('GraphService', 'ComputeLayerIO', {layerId});
      const i = io.i?.map(path => path.replace(/\$/g, '.'));
      return {layerId, io: i};
    }
  }
},
template: html`
<style>
  ::slotted(*) {
    flex: 1 !important;
    width: auto !important;
    height: auto !important;
  }
</style>
<slot name="Container">
`
});