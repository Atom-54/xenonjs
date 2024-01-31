export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({graph, graphId}, state, {service}) {
  const createLayer = graph => service('LayerService', 'CreateLayer', {id: graph});
  graph = graph ?? ((typeof graphId === 'object') && graphId);
  if (graph) {
    log('CreateLayer("<from code>")');
    await createLayer(graph);
  } else if (graphId) {
    log('CreateLayer("' + graphId + '")');
    await createLayer(graphId);
  }
},
template: html`
<slot name="Container"></slot>
`
});
  