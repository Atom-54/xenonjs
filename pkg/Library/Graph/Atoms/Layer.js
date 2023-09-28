export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({graphId, graph, data, designable}, state, {service, isDirty, output}) {
  if (isDirty('data')) {
    output({data});
  }
  const fullId = graphId ?? this.getFullId(graph);
  if (state.layerId && state.fullId !== fullId) {
    await service('GraphService', 'DestroyLayer', {layerId: state.layerId});
    state.layerId = null;
  }
  state.fullId = fullId;
  if (!state.layerId && (graphId || graph)) {
    const layerId = state.layerId = await service('GraphService', 'CreateLayer', {graph, graphId, designable});
    if (layerId) {
      //await service('GraphService', 'CreateLayerBinding', {layerId});
      //const io = await service('GraphService', 'ComputeLayerIO', {layerId});
      //const i = io.i?.map(path => path.replace(/\$/g, '.'));
      return {layerId}; //, io: i};
    }
  }
},
// TODO(maria): this is duplicate code, should be factored.
localPrefix: 'local:',
getFullId(graph) {
  if (graph) {
    const {meta} = graph;
    if (meta.readonly) {
      if (meta.ownerId) {
        return `${meta.ownerId}/${meta.id}`;
      } else {
        return meta.id;
      }
    } else {
      return `${this.localPrefix}${meta.id}`;
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