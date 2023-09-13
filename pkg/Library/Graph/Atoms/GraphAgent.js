export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
defaultDesignerId: 'Main',
publicGraphsPath: 'publicGraphs',
initialize(inputs, state, {service}) {
  state.select = graph => service('GraphService', 'SelectGraph', {graph});
  state.makeName = () => service('GraphService', 'MakeName');
},
shouldUpdate({graphs, user}) {
  return graphs;
},
async update(inputs, state, tools) {
  if (tools.isDirty('user')) {
    state.user = inputs.user;
  }
  //
  await this.loadPublicGraphs(inputs, state, tools);	
  //
  const outputs = await this.initGraphs(inputs, state, tools);
  if (outputs) {
    return outputs;
  }
  if (state.addDefault) {
    state.addDefault = false;
    this.addFirstDefaultNode(inputs, tools);
  }
  //
  const {event} = inputs;
  if (event && !deepEqual(event, state.event)) {
    // TODO(maria): limit all events, except 'select' to non `readonly`.
    // Consider making 'readonly' property of the event?
    // Or just SelectGraph in GraphList, not via event?
    state.event = event;
    const outputs = {event: {...event, complete: true}};
    if (!event.complete || (event.status === 'error')) {
      assign(outputs, await this.handleEvent(inputs, state, tools));
    }
    return outputs;
  }
},
async loadPublicGraphs({publishedGraphsUrl}, state, {output, isDirty}) {
  //if (isDirty('publishedGraphsUrl')) {
    state.publishedGraphsUrl = publishedGraphsUrl;
    const res = await fetch(this.formatFetchPublishGraphsUrl(publishedGraphsUrl));
    if (res.status === 200) {
      // Replacing % with $ is backward compatibility for graphs,
      // that were published before double stringification.
      const text = (await res.text())?.replace(/%/g, '$');
      const parsed = values(JSON.parse(text)).map(v => typeof v === 'string' ? JSON.parse(v) : v);
      const publicGraphs = parsed.map(g => g.meta ? g : values(g)?.map(gg => JSON.parse(gg))).flat()
      if (!publicGraphs.every(g => g.meta.readonly)) {
        log.warn(`All public graphs must be readonly`);
      }
      output({publicGraphs});
    }
  //}
},
formatFetchPublishGraphsUrl(publishedGraphsUrl) {
  return `${publishedGraphsUrl}/${this.publicGraphsPath}.json`;
},
sanitizeId(str) {
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
},
sanitizeOwnerId(owner) {
  return this.sanitizeId(owner?.split('@')?.[0] ?? 'anonymous').toLowerCase();
},
formatPutPublishGraphUrl(graphId, owner, {publishedGraphsUrl}) {
  return `${publishedGraphsUrl}/${this.publicGraphsPath}/${this.sanitizeOwnerId(owner)}/${this.sanitizeId(graphId)}.json`;
},
initGraphs(inputs, state) {
  let {readonly, graph, graphs, publicGraphs, selectedMeta} = inputs;
  //log(graph, graphs.length);
  const matches = ({id, readonly, owner}, meta) => id === meta?.id && readonly === meta?.readonly && owner === meta?.owner;
  if (!readonly) {
    if (!graphs?.length) {
      return this.addGraph(inputs, state);
    }
    graph ??= this.retrieveGraph(selectedMeta, graphs, publicGraphs);
    if (graph && matches(graph, state.selectedMeta)) {
      return this.doSelectGraph(selectedMeta, graph, state);
    }
  } else {
    if (!matches(state.selectedMeta !== selectedMeta)) {
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
async addFirstDefaultNode({}, {service}) {
  return service('GraphService', 'MorphObject', {
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
    state.select(graph);
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
      return this.deleteGraph(event.data.value, graph, graphs, service);
    case 'Clone Graph':
      return this.cloneGraph(event.data.value, graphs, publicGraphs, state);
    case 'Rename Graph':
      return this.renameGraph(event.data, graph, graphs);
    case 'Restyle Graph':
      return this.restyleGraph(event.data.value, graphs, state);
    case 'Refresh Public Graphs':
      delete state.publishedGraphsUrl;
      return this.loadPublicGraphs(inputs, state, {output});
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
      ...(graph?.meta?.id === meta.id) && {graph: graphs[index]}
    }
  }
},
deleteGraph(id, graph, graphs, service) {
  const index = graphs?.findIndex(g => g.meta.id === id);
  if (index >= 0) {
    // TODO(maria): add an 'are you sure?'
    graphs.splice(index, 1);
    if (id === graph?.meta?.id) {
      service('GraphService', 'UnselectGraph', {graph});
    }
    return {
      graphs,
      ...((id === graph?.meta?.id) && {graph : null})
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
      ...this.selectGraph(clonedGraph, state)
    };
  }
},
renameGraph({originalId, newId}, graph, graphs) {
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
      graph: modified
    };
  }
},
restyleGraph(id, graphs, state) {
  const graph = this.findGraph(id, graphs);
  if (graph) {
    delete graph.meta.stylized;
    return {graph, ...this.selectGraph(graph, state)};
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
    return {publicGraphs};
  }
},
async unpublishGraph(id, publicGraphs, state) {
  const index = publicGraphs.findIndex(({meta}) => meta.id === id);
  await this.removePublishedGraph(publicGraphs[index]?.meta, state);
  publicGraphs.splice(index, 1);
  return {publicGraphs};
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
