export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/* global keys, values */
update({graph, selected}, state) {
  state.info = this.projectContainerTree(graph);
  if (state.selected !== selected) {
    return this.select(selected, state);
  }
},
getObjectId(id) {
  return id?.split('$').slice(0, -1).join('$') ?? '';
},
projectContainerTree(graph) {
  const tree = create(null);
  keys(graph?.nodes).forEach(id => this.addObjectToTree(graph, tree, id));
  return tree;
},
addObjectToTree(graph, tree, id) {
  const node = graph?.nodes[id];
  const oid = this.getObjectId(node?.container);
  if (oid.includes('$')) {
    log(`THIS SHOULD NEVER HAPPEN: oid '${oid}' SHOULD NOT CONTAIN $`);
  }
  if (!graph?.nodes[oid]) {
    return tree[id] ??= create(null);
  }
  const treeNode = this.addObjectToTree(graph, tree, oid);
  return treeNode[id] ??= create(null);
},
render({/*selected*/}, {info, selected}) {
  if (!keys(info).length) {
    return {
      msg: 'Object tree is empty',
      hideMsg: false,
      graphNodes: []
    };
  }
  //log(selected, oid, info);
  return {
    graphNodes: this.renderGraphNodes(info, selected),
    hideMsg: true
  };
},
renderGraphNodes(info, oid) {
  return entries(info)
    .map(([key, node]) => ({
      selected: oid === key,
      icon: 'settings',
      id: key,
      name: key,
      displayName: key,
      nodes: this.renderGraphNodes(node, oid)
    }))
    .sort((a,b) => a.displayName.localeCompare(b.displayName))
  ;
},
onNodeSelect({eventlet: {key}}, state) {
  if (state.selected !== key) {
    return this.select(key, state);
  }
},
select(selected, state) {
  if (selected?.includes('$')) {
    log(`THIS SHOULD NEVER HAPPEN: selected '${selected}' SHOULD NOT CONTAIN $`);
  }
  state.selected = selected;
  return {selected};
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
  [atom] {
    font-size: 0.9rem;
    font-weight: bold;
    overflow: hidden;
    border-radius: 6px;
    background-color: var(--xcolor-one);
  }
  [selected][atom] {
    /* color: var(--xcolor-two); */
    background-color: var(--xcolor-two);
  }
  [selected] [atom] {
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
  [nodes] {
    background-color: var(--theme-color-bg-0);
    overflow: hidden;
    padding-left: 12px;
  }
  icon {
    font-size: 16px;
    width: 16px;
    height: 21px;
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
</style>

<div center row flex message hidden="{{hideMsg}}">{{msg}}</div>
<div flex scrolling repeat="node_t">{{graphNodes}}</div>

<template node_t>
  <div node key="{{id}}" on-click="onNodeSelect">
    <draggable-item atom selected$="{{selected}}" row key="{{id}}" name="{{displayName}}"></draggable-item>
    <div inner-nodes flex repeat="node_t">{{nodes}}</div>
  </div>
</template>
`
});
