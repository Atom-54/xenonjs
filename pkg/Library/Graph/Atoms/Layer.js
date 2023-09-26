export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({graph, graphJson, data, designable}, state, {service, isDirty, output}) {
  if (isDirty('data')) {
    output({data});
  }
  const id = graph ?? graphJson?.meta?.id;
  if (state.layerId && state.id !== id) {
    await service('GraphService', 'DestroyLayer', {layerId: state.layerId});
    state.layerId = null;
  }
  state.id = id;
  if (!state.layerId && (graph || graphJson)) {
    const layerId = state.layerId = await service('GraphService', 'CreateLayer', {graph: graphJson, graphId: graph, designable});
    if (layerId) {
      //await service('GraphService', 'CreateLayerBinding', {layerId});
      //const io = await service('GraphService', 'ComputeLayerIO', {layerId});
      //const i = io.i?.map(path => path.replace(/\$/g, '.'));
      return {layerId}; //, io: i};
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