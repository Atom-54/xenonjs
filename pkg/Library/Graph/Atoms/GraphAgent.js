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
  return graphs && keys(user).length;
},
async update(inputs, state, tools) {
  state.user ??= inputs.user;
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
      output({
        publicGraphs: parsed.map(g => g.meta ? g : values(g)?.map(gg => JSON.parse(gg))).flat()
      });
    }
  //}
},
formatFetchPublishGraphsUrl(publishedGraphsUrl) {
  return `${publishedGraphsUrl}/${this.publicGraphsPath}.json`;
},
formatPutPublishGraphUrl(graphId, owner, {publishedGraphsUrl}) {
  const sanitize = str => str.replace(/[^a-zA-Z0-9\s]/g, '');
  return `${publishedGraphsUrl}/${this.publicGraphsPath}/${sanitize(owner?.split('@')?.[0])}/${sanitize(graphId)}.json`;
},
initGraphs(inputs, state, {service}) {
  let {readonly, graph, graphs, selectedId} = inputs;
  //log(graph, graphs.length);
  if (!readonly) {
    if (!graphs?.length) {
      return this.addGraph(inputs, state);
    }
    graph ??= this.graphById(selectedId, graphs);
    if (graph && graph.meta?.id !== state.selectedId) {
      return this.selectGraph(graph, state);
    }
  } else {
    if (state.selectedId !== selectedId) {
      return this.selectGraphById(selectedId, inputs, state);
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
      timestamp: Date.now(),
      owner: user?.email,
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
graphById(id, graphs) {
  return graphs?.find(({meta}) => meta?.id === id);
},
selectGraphById(id, {graphs, publicGraphs}, state) {
  if (state.selectedId !== id) {
    const selectedGraph = this.graphById(id, graphs) ?? this.graphById(id, publicGraphs);
    return this.selectGraph(selectedGraph, state);
  }
},
selectGraph(graph, state) {
  if (graph && state.selectedId != graph.meta.id) {
    //service({kind: 'GraphService', msg: 'SelectGraph', data: {graph}});
    state.select(graph);
    state.selectedId = graph.meta.id;
    return {graph, selectedId: state.selectedId};
  }
},
async handleEvent(inputs, state, {service, output}) {
  const {event, graph, graphs, publicGraphs} = inputs;
  switch (event.action.name) {
    case 'Add Graph':
      return this.addGraph(inputs, state);
    case 'Select Graph':
      return this.selectGraphById(event.data.value, inputs, state);
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
uniqifyId(id, graphs, publicGraphs) {
  let i = 0;
  while (this.graphById(id, graphs) || this.graphById(id, publicGraphs)) {
    id = `${id} (${++i})`;
  }
  return id;
},
async cloneGraph(id, graphs, publicGraphs, state) {
  const graph = this.graphById(id, graphs) ?? this.graphById(id, publicGraphs);
  if (graph) {
    const copyId = `Copy of ${graph.meta.id}`;
    const {meta} = this.newGraph({
      ...graph.meta,
      readonly: false,
      id: this.uniqifyId(copyId, graphs, publicGraphs)
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
  const graph = this.graphById(id, graphs);
  if (graph) {
    delete graph.meta.stylized;
    return {graph, ...this.selectGraph(graph, state)};
  }
},
async publishGraph(id, graphs, publicGraphs, state) {
  const graph = this.graphById(id, graphs);
  const publicGraph = {...graph, meta: {...graph.meta, readonly: true}};

  const result = await this.putPublishedGraph(graph.meta, publicGraph, state)
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
async putPublishedGraph({id, owner}, graph, state) {
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
