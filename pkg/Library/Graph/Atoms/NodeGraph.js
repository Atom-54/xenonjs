export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({graph, selected}, state, {service}) {
  if (!deepEqual(graph, state.graph)) {
    state.graphRects = {};
    state.graph = graph;
    if (graph) {
      state.graphInfo = await service('GraphService', 'GetGraphInfo', {graph: state.graph});
    } else {
      state.graphInfo = null;
      selected = null;
    }
  }
  if (state.selectedId !== selected) {
    state.selectedId = selected;
    return {selected};
  }
},

render(inputs, {graph, selectedId, graphInfo}) {
  return {
    // not really a graph
    graph: this.renderGraph(graph, selectedId, graphInfo),
    graphRects: graph?.meta?.graphRects ?? {}
  };
},

renderGraph(graph, selectedId, graphInfo) {
  return {
    name: graph?.meta?.id,
    graphNodes: this.renderGraphNodes(graph, selectedId, graphInfo),
    graphEdges: this.renderGraphEdges(graph)
  };
},

renderGraphNodes(graph, selectedId, graphInfo) {
  const renderNode = id => {
    return {
      key: id,
      name: id,
      displayName: id,
      selected: selectedId === id,
      ...this.renderIO(id, graphInfo)
    }
  };
  return keys(graph?.nodes).filter(i=>i!='Main').map(id => renderNode(id));
},

renderGraphEdges(graph) {
  const mapEdges = ([to, from]) => {
    const toTokens = to.split('$');
    const toConn = {
      id: toTokens.shift(),
      storeName: toTokens.pop()
    };
    if (typeof from === 'string') {
      from = [from];
    }
    return from?.map(from => {
      const fromTokens = from.split('$');
      return {
        from: {
          id: fromTokens.shift(),
          storeName: fromTokens.pop()
        },
        to: toConn
      };
    });
  };
  return entries(graph?.connections).map(mapEdges).flat();
},

renderIO(id, graphInfo) {
  const atoms = this.getAtomsByPrefix(id, graphInfo);
  return {
    inputs: atoms.flatMap(atom => this.renderDataChannel(atom, atom.inputs??[])),
    outputs: atoms.flatMap(atom => this.renderDataChannel(atom, atom.outputs??[]))
  };
},

renderDataChannel(atom, channel) {
  //const n = atom.id.replace('_', '-');
  return channel.map(i => ({
    //name: `${n}-${i}`, 
    name: i,
    type: atom.types?.[`${atom.id}$${i}`] ?? 'Pojo'
  }))
},

getAtomsByPrefix(id, graphInfo) {
  // $NameOfObject$[<nameOfNode$>nameOfAtom]
  // -----idl-----^ == slicing length to remove $id$
  const idl = id.length + 2;
  return entries(graphInfo?.system)
    .filter(([atomId]) => atomId.startsWith(`$${id}$`))
    .map(([id, atom]) => ({...atom, id: id.slice(idl)}))
    ;
},

onNodeSelect({eventlet: {key}}, state) {
  //log(`selected ${key}`);
  if (state.selectedId !== key) {
    state.selectedId = key;
    return {selected: key};
  }
},

onNodeMoved({eventlet: {key, value}}, {graph}, {service}) {
  const graphRects = graph.meta.graphRects ??= {};
  keys(value).forEach(key => value[key] = Math.round(value[key]));
  if (JSON.stringify(graphRects[key]) !== JSON.stringify(value)) {
    graphRects[key] = value;
    const meta = {...graph.meta, graphRects};
    service('DesignService', 'SetGraphMeta', meta);
    return {
      graph: {...graph, meta}
    }
  }
},

template: html`
<style>
  :host {
    display: flex;
    flex: 1 !important;
    /* height: 100%; */
    position: relative;
    font-size: 12px;
    color: black;
    background-color: var(--theme-color-bg-1);
    border: var(--NodeEditor-border);
    --edge-border: 1px solid #555;
    --mdc-icon-size: 18px;
    --mdc-icon-button-size: 26px;
  }
  mwc-icon-button {
    color: #555;
  }
  [floating] {
    position: absolute;
    top: 0;
    left: 0;
  }
  drop-target {
    height: auto !important;
  }
  node-graph {
    display: block;
    overflow: visible;
  }
</style>

<drop-target flex scrolling on-target-drop="onNodeTypeDropped">
  <node-graph graph="{{graph}}" rects="{{graphRects}}" on-node-moved="onNodeMoved" on-node-selected="onNodeSelect"></node-graph>
</drop-target>
<!-- last, therefore on top -->
<div floating><slot name="toolbar"></slot></div>
`
});