export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
defaultDesignerId: 'Main',
initialize(inputs, state, {service}) {
  state.makeName = () => service('GraphService', 'MakeName');
},
shouldUpdate({graphs, user}) {
  return graphs;
},
async update(inputs, state, {output, isDirty, service}) {
  const {user, publishedGraphsUrl, event} = inputs;
  if (isDirty('user')) {
    state.user = user;
  }
  if (publishedGraphsUrl && isDirty('publishedGraphsUrl')) {
    state.publishedGraphsUrl = publishedGraphsUrl;
    const publicGraphs = await this.loadPublicGraphs(publishedGraphsUrl)
    output({publicGraphs});
  }
  // TODO(maria): refactor `initGraphs` so that it takes explicit inputs and return values are explicit.
  const outputs = await this.initGraphs(inputs, state);
  if (outputs) {
    return outputs;
  }
  // if (state.addDefault) {
  //   state.addDefault = false;
  //   this.addFirstDefaultNode(service);
  // }
  if (event && !deepEqual(event, state.event)) {
    // TODO(maria): limit all events, except 'select' to non `readonly`.
    // Consider making 'readonly' property of the event?
    // Or just SelectGraph in GraphList, not via event?
    state.event = event;
    const outputs = {event: {...event, complete: true}};
    if (!event.complete || (event.status === 'error')) {
      assign(outputs, await this.handleEvent(inputs, state, {service, output}));
    }
    return outputs;
  }
},
async loadPublicGraphs(publishedGraphsUrl) {
  const url = this.formatFetchPublishGraphsUrl(publishedGraphsUrl);
  const res = await fetch(url);
  if (res.status === 200) {
    // Replacing % with $ is backward compatibility for graphs,
    // that were published before double stringification.
    const text = (await res.text())?.replace(/%/g, '$');
    const parsed = values(JSON.parse(text)).map(v => typeof v === 'string' ? JSON.parse(v) : v);
    const publicGraphs = parsed.map(g => g.meta ? g : values(g)?.map(gg => JSON.parse(gg))).flat()
    if (!publicGraphs.every(g => g.meta.readonly)) {
      log.warn(`All public graphs must be readonly`);
    }
    return publicGraphs;
  }
},
formatFetchPublishGraphsUrl(publishedGraphsUrl) {
  return `${publishedGraphsUrl}.json`;
},
sanitizeId(str) {
  return str?.replace(/[^a-zA-Z0-9\s]/g, '');
},
sanitizeOwnerId(owner) {
  return this.sanitizeId(owner?.split('@')?.[0])?.toLowerCase();
},
formatPutPublishGraphUrl(graphId, owner, {publishedGraphsUrl}) {
  const ownerId = this.sanitizeOwnerId(owner) ?? 'anonymous';
  return `${publishedGraphsUrl}/${ownerId}/${this.sanitizeId(graphId)}.json`;
},
initGraphs(inputs, state) {
  let {readonly, graph, graphs, publicGraphs, selectedMeta} = inputs;
  //log(graph, graphs.length);
  const matches = ({id, readonly, owner}, meta) => id === meta?.id && readonly === meta?.readonly && owner === meta?.owner;
  if (!readonly) {
    if (!graphs?.length) {
      return this.addGraph({graphs}, state);
    }
    graph ??= this.retrieveGraph(selectedMeta, graphs, publicGraphs);
    if (graph && !matches(graph.meta, state.selectedMeta)) {
      return this.doSelectGraph(selectedMeta, graph, state);
    }
  } else {
    if (!matches(state.selectedMeta, selectedMeta)) {
      return this.doSelectGraph(selectedMeta, graph, state);
    }
  }
},
async addGraph({graphs}, state) {
  const id = await state.makeName();
  //
  const newGraph = this.newGraph({id}, state);
  if (!graphs?.length) {
    state.addDefault = true;
  }
  graphs.push(newGraph);
  return {
    graphs,
    ...this.selectGraph(newGraph, state)
  }
},
newGraph({id, designerId, ...meta}, {user}) {
  designerId ??= this.defaultDesignerId;
  return {
    meta: {
      ...meta,
      id,
      designerId,
      timestamp: Date.now()
    },
    nodes: {
      [designerId]: {
        type: '$library/Layout/Nodes/DesignerNode',
        container: 'root$panel#Container'
      }
    }
  };
},
async addFirstDefaultNode(service) {
  return service('DesignService', 'MorphObject', {
    type: {type: '$library/EchoNode'},
    state: {
      'echo$html': `Welcome to Build!<br><br>
        Click to select and edit me using the Inspector panel on the right.<br><br>
        Or click + to add more objects.<br>
      `,
      'echo$style': `background-color: thistle; text-align:center; padding: 10px;`
    },
    layout: {width: 'auto'}
  });
},
findGraph(id, graphs) {
  return graphs?.find(({meta}) => meta?.id === id);
},
findPublicGraph(id, owner, publicGraphs) {
  return publicGraphs?.find(({meta}) => meta?.id === id && meta?.owner === owner);
},
retrieveGraph(meta, graphs, publicGraphs) {
  if (meta) {
    const {id, readonly, owner} = meta;
    if (readonly) {
      return this.findPublicGraph(id, owner, publicGraphs);
    } else {
      return this.findGraph(id, graphs);
    }
  }
},
selectGraphByMeta(selectedMeta, {graphs, publicGraphs}, state) {
  const graph = this.retrieveGraph(selectedMeta, graphs, publicGraphs);
  return this.doSelectGraph(selectedMeta, graph, state);
},
selectGraph(graph, state) {
  const selectedMeta = {
    id: graph?.meta?.id,
    readonly: graph?.meta?.readonly,
    owner: graph?.meta?.owner
  };
  return this.doSelectGraph(selectedMeta, graph, state);
},
doSelectGraph(selectedMeta, graph, state) {
  selectedMeta.ownerId = this.sanitizeOwnerId(selectedMeta.owner);
  if (graph && !deepEqual(state.selectedMeta, selectedMeta)) {
    state.selectedMeta = selectedMeta;
    return {graph, selectedMeta};
  }
},
async handleEvent(inputs, state, {service, output}) {
  const {event, graph, graphs, publicGraphs} = inputs;
  switch (event.action.name) {
    case 'Add Graph':
      return this.addGraph(inputs, state);
    case 'Select Graph':
      return this.selectGraphByMeta(event.data.value, inputs, state);
    case 'Delete Graph':
      return this.deleteGraph(event.data.value, graph, graphs);
    case 'Clone Graph':
      return this.cloneGraph(event.data.value, graphs, publicGraphs, state);
    case 'Rename Graph':
      return this.renameGraph(event.data, graph, graphs, state);
    case 'Restyle Graph':
      return this.restyleGraph(event.data.value, graphs, state);
    case 'Refresh Public Graphs': {
      const publicGraphs = await this.loadPublicGraphs(inputs.publishedGraphsUrl, state, {output});
      return {publicGraphs};
    }
    case 'Publish Graph':
      return this.publishGraph(event.data.value, graphs, publicGraphs, state);
    case 'Unpublish Graph':
      return this.unpublishGraph(event.data.value, publicGraphs, state);
    case 'Set Graph Meta':
      return this.setGraphMeta(event.data, graph, graphs);
  }
},
setGraphMeta({meta}, graph, graphs) {
  const index = graphs?.findIndex(g => g.meta.id === meta?.id);
  if (index >= 0) {
    graphs[index].meta = meta;
    return {
      graphs,
      ...(graph?.meta?.id === meta.id) && {graph: graphs[index]},
      message: `Updated metadata for graph '${meta.id}'`
    }
  }
},
deleteGraph(id, graph, graphs) {
  const index = graphs?.findIndex(g => g.meta.id === id);
  if (index >= 0) {
    const isSelected = !graph?.meta?.readonly && (id === graph?.meta?.id)
    // TODO(maria): add an 'are you sure?'
    graphs.splice(index, 1);
    return {
      graphs,
      ...(isSelected && {graph: null, selectedMeta: null}),
      message: `Deleted graph '${id}`
    };
  }
},
uniqifyId(id, graphs) {
  let i = 0;
  while (this.findGraph(id, graphs)) {
    id = `${id} (${++i})`;
  }
  return id;
},
async cloneGraph(meta, graphs, publicGraphs, state) {
  const graph = this.retrieveGraph(meta, graphs, publicGraphs);
  if (graph) {
    const copyId = `Copy of ${graph.meta.id}`;
    const {meta} = this.newGraph({
      ...graph.meta,
      readonly: false,
      owner: '',
      id: this.uniqifyId(copyId, graphs)
    }, state);
    const clonedGraph = {...graph, meta};
    graphs.push(clonedGraph);
    return {
      graphs,
      ...this.selectGraph(clonedGraph, state),
      message: `Graph '${clonedGraph.meta.id}' was cloned from graph '${graph.meta.id}.`
    };
  }
},
renameGraph({originalId, newId}, graph, graphs, state) {
  if (!this.findGraph(newId, graphs)) {
    let graphIndex = graphs.findIndex(g => g?.meta?.id === originalId);
    if (graphIndex < 0) {
      graphIndex = graphs.findIndex(g => deepEqual(g, graph));
    }
    if (graphIndex >= 0) {
      const modified = graphs[graphIndex];
      modified.meta ??= {};
      modified.meta.id = newId;
      return {
        graphs,
        ...this.selectGraph(modified, state),
        message: `Renamed graph to '${newId}'`
      };
    }
  } else {
    log.warn(`Graph with name ${newId} already exists`);
    return {message: `Graph with name '${newId}' already exists`};
  }
},
restyleGraph(id, graphs, state) {
  const graph = this.findGraph(id, graphs);
  if (graph) {
    delete graph.meta.stylized;
    return this.selectGraph(graph, state);
  }
},
async publishGraph(id, graphs, publicGraphs, state) {
  const graph = this.findGraph(id, graphs);
  const publicGraph = {...graph, meta: {...graph.meta, readonly: true, owner: state.user?.email}};
  const result = await this.putPublishedGraph(publicGraph, state)
  if (result) {
    let publicIndex = publicGraphs.findIndex(graph => graph.meta.id === id && graph.meta.owner === state.user?.email);
    if (publicIndex >= 0) {
      publicGraphs[publicIndex] = publicGraph;
    } else {
      publicGraphs.push(publicGraph);  
    }
    return {
      publicGraphs,
      message: `Published graph '${id}'`
    };
  }
},
async unpublishGraph(id, publicGraphs, state) {
  const index = publicGraphs.findIndex(({meta}) => meta.id === id);
  if (index >= 0) {
    const unpublishedMeta = publicGraphs[index].meta;
    await this.removePublishedGraph(unpublishedMeta, state);
    publicGraphs.splice(index, 1)?.[0];
    const isSelected = (unpublishedMeta.id === state.selectedMeta.id) && (unpublishedMeta.owner === state.selectedMeta.owner);
    return {
      publicGraphs,
      ...(isSelected && {graph: null, selectedMeta: null}),
      message: `Unpublished graph '${id}'`
    };
  }
},
async putPublishedGraph(graph, state) {
  const {id, owner} = graph.meta;
  const url = this.formatPutPublishGraphUrl(id, owner, state);
  const result = await fetch(url, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(JSON.stringify(graph))
  });
  if (!result.ok) {
    log(`Failed publishing graph '${id}' to ${url} (${result.statusText})`);
  }
  return result.ok;
},
async removePublishedGraph({id, owner}, state) {
  return fetch(this.formatPutPublishGraphUrl(id, owner, state), {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  });
}
});
