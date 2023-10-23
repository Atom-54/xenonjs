export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({layerId, graph, selected}, state, {service}) {
  if (layerId) {
    graph = await service('GraphService', 'GetLayerGraph', {layerId});
  }
  state.tree = await this.projectContainerTree(graph, service);
  if (state.selected !== selected) {
    return this.select(selected, state);
  }
},
getObjectId(id) {
  return id?.split('$').slice(0, -1).join('$') ?? '';
},
async projectContainerTree(graph, service) {
  const tree = {};
  const ids = keys(graph?.nodes);
  for (let id of ids) {
    await this.addObjectToTree(graph, tree, id, service);
  }
  //log('projectContainerTree', ids, tree);
  return tree;
},
async addObjectToTree(graph, tree, id, service) {
  // this graph object
  const object = graph?.nodes[id];
  // has this layout
  const layout = graph.state?.Main$designer$layout[id];
  const meta = await service('GraphService', 'FetchNodeMeta', {type: object?.type});
  // has this container-id
  const oid = this.getObjectId(object?.container);
  // output node
  let node;
  // if this container is not part of the graph
  if (!graph?.nodes[oid]) {
    // top of tree
    node = tree[id] = await this.makeTreeNode(id, layout, meta);
  } else {
    // add container node to tree
    const containerNode = tree[oid] || await this.addObjectToTree(graph, tree, oid, service);
    // use existing node, if possible
    node = containerNode.nodes[id] ??= await this.makeTreeNode(id, layout, meta);
  }
  // done
  return node;
},
async makeTreeNode(id, layout, meta) {
  return {
    id,
    nodes: {},
    layout, //: await service('DesignService', 'GetLayoutObject', {objectId: id}),
    icon: meta.ligature || 'build_circle'
  };
},
render({/*selected*/}, {tree, selected}) {
  if (!keys(tree).length) {
    return {
      msg: 'Object tree is empty',
      hideMsg: false,
      graphNodes: []
    };
  }
  //log(selected, oid, info);
  return {
    graphNodes: this.renderGraphNodes(tree, selected),
    hideMsg: true
  };
},
renderGraphNodes(tree, oid) {
  return entries(tree)
    .map(([key, node]) => ({
      selected: oid === key,
      icon: node.icon,
      id: key,
      name: key,
      displayName: key,
      nodes: this.renderGraphNodes(node.nodes, oid),
      order: node.layout?.order || 0
    }))
    .sort((a,b) => a.order - b.order)
    //.sort((a,b) => a.displayName.localeCompare(b.displayName))
  ;
},
onNodeSelect({eventlet: {key}}, state) {
  if (state.selected !== key) {
    return this.select(key, state);
  }
},
select(selected, state) {
  if (selected?.includes('$')) {
    log.warn(`selected '${selected}' SHOULD NOT CONTAIN $`);
  }
  state.selected = selected;
  return {selected};
},
async onDropBefore({eventlet: {key, value}}, state, {service}) {
  log('onDropBefore: from:', value, 'to:', key);
  return service('DesignService', 'OrderBefore', {objectId: value, before: key});
},
async onDrop({eventlet: {key, value}}, state, {service}) {
  // const [objectId, container] = [value, key];
  // log('onDrop:', objectId, 'to:', container);
  // await service('DesignService', 'SimpleContain', {objectId, container});
  // TODO(sjmiles): fix key/value inversion downstream
  //await service('DesignService', 'Contain', {key: value, value: key});
},
async onDropAfter({eventlet: {key, value}}, state, {service}) {
  log('onDropAfter: from:', value, 'to:', key);
  return service('DesignService', 'OrderAfter', {objectId: value, after: key});
},
template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    padding: 8px;
    --xcolor-hi-one: rgb(212, 13, 242);
  }
  [scrolling] {
    padding-right: 6px;
  }
  [node] {
    border-left: 1px solid transparent;
  }
  [object] {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    font-size: 0.9rem;
    overflow: hidden;
  }
  [item] {
    display: flex;
    align-items: center;
    border-radius: 6px;
    padding: 2 6px;
    background-color: var(--xcolor-one);
  }
  [selected][object] {
    /* color: var(--xcolor-two); */
    background-color: var(--xcolor-two);
  }
  [selected] [object] {
    border-left: 1px solid var(--border-color);
  }
  [selected] [bar] {
    border-left: 1px solid var(--border-color);
  }
  [name] {
    padding-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  icon {
    font-size: 16px;
  }
  [inner-nodes] {
    margin-left: 12px;
    border-left: 1px dotted var(--xcolor-hi-one);
  }
  [message] {
    color: var(--xcolor-three);
    background-color: var(--xcolor-one);
    font-size: 13px;
  }
  [flag] {
    height: 12px;
    width: 12px;
    padding: 5px;
    border: 1px dotted var(--xcolor-hi-one);
    border-width: 0 0 1px 1px;
  }
  drop-target[over] {
    background-color: var(--xcolor-hi-one);
  }
  [before], [after] {
    height: 4px;
  }
</style>

<div center row flex message hidden="{{hideMsg}}">{{msg}}</div>
<div flex scrolling repeat="node_t">{{graphNodes}}</div>

<template node_t>
  <div node key="{{id}}" on-click="onNodeSelect">
    <drag-able object selected$="{{selected}}" key="{{id}}" name="{{displayName}}">
      <!-- <svg style="height: 28px; width: 16px;" viewBox="0 0 16 28" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="14" x2="16" y2="14" stroke="var(--xcolor-hi-one)" stroke-dasharray="1"/>
        <line x1="12" y1="14" x2="12" y2="28" stroke="var(--xcolor-hi-one)" stroke-dasharray="1"/>
      </svg> -->
      <drop-target before key="{{id}}" on-target-drop="onDropBefore"></drop-target>
      <drop-target disabled item key="{{id}}" on-target-drop="onDrop">
        <icon>{{icon}}</icon>
        <span style="padding: 0 0 1px 6px;">{{displayName}}</span>
        &nbsp;(<span>{{order}}</span>)
      </drop-target>
      <drop-target after key="{{id}}" on-target-drop="onDropAfter"></drop-target>
    </drag-able>
    <div inner-nodes flex repeat="node_t">{{nodes}}</div>
  </div>
</template>
`
});
