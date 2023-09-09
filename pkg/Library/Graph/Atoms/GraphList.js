export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
defaultDescription: 'describe your graph',
initialize(inputs, state) {
  state.events = [];
},
update({user, graph, event}, state) {
  //log(graph);
  state.user = user?.email;
  return this.dispatchEvent(event, state);
},
render({readonly, graph, graphs, publicGraphs, showMode, search}, state) {
  const graphItems = showMode === 'private'
      ? this.renderGraphItems({readonly, graph, graphs, search}, state)
      : showMode === 'public'
        ? this.renderGraphItems({readonly, isPublic: true, graph, graphs: publicGraphs, search}, state)
        : [];
  return {readonly, graphItems};
},
renderGraphItems({readonly, isPublic, graphs, graph, search}, {user}) {
  search = search?.toLowerCase?.() || '';
  //log(`search =`, search);
  const isOwned = ({meta}) => user === meta?.owner;
  const includes = value => value?.toLowerCase?.().includes(search);
  const match = ({meta, nodes}) => !search
    || meta && (
      includes(meta.id)
      || includes(meta.description)
      || keys(nodes).some(key => includes(key))
    )
    ;
  return graphs
    ?.sort((a,b)=>(b.meta?.timestamp??0)-(a.meta?.timestamp??0))
    .filter(g => match(g))
    .map(g => ({
      readonly,
      isPublic: Boolean(isPublic),
      id: g.meta?.id ?? '(anon)',
      description: g.meta?.description ?? this.defaultDescription,
      hideOwner: String(false), //!isPublic),
      owner: g.meta?.owner?.split('@')?.shift() ?? 'anonymous',
      timestamp: g.meta ? new Date(g.meta.timestamp).toLocaleDateString() : '',
      selected: g.meta?.id === graph?.meta?.id,
      isOwned: isOwned(g),
      hidePublish: Boolean(!user || isPublic),
      hideUnpublish: Boolean(!user || !isPublic || !isOwned(g))
    }))
    ;
},
onEvent({eventlet: {key: name, value}}, state) {
  return this.addEvent({action: {name}, data: {value}}, state)
},
onRename({eventlet: {key: originalId, value: newId}}, state) {
  const event = {
    action: {name: 'Rename Graph'},
    data: {originalId, newId}
  };
  return this.addEvent(event, state)
},
onDescribe({eventlet: {key, value}, graphs}, state) {
  const graph = graphs?.find(g => g.meta.id === key);
  if (graph) {
    const event = {
      action: {name: 'Set Graph Meta'},
      data: {meta: {...graph.meta, description: value}}
    };
    return this.addEvent(event, state);
  }
},
addEvent(event, state) {
  state.events.push(event);
  if (!state.eventKey) {
    return this.getNextEvent(state);
  }
},
dispatchEvent(event, state) {
  // dispatch events one at a time
  if (state.eventKey && event?.key === state.eventKey && event?.complete) {
    state.eventKey = null;
    return this.getNextEvent(state);
  }
},
getNextEvent(state) {
  const fresh = state.events.shift();
  if (fresh) {
    state.eventKey = Math.random();
    return {event: {...fresh, key: state.eventKey}};
  }
},
template: html`
<style>
  :host {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--xcolor-two);
    min-height: 500px;
    --shadow: 6px 6px 12px var(--xcolor-two), -6px -6px 12px var(--xcolor-one);
    --shadow-hover: 9px 9px 12px var(--xcolor-two), -9px -9px 12px var(--xcolor-one);
  }
  [toolbar] {
    height: 40px;
  }
  [grid] {
    align-content: flex-start;
  }
  [grid] > * {
    min-width: 4em;
    min-height: 4em;
    flex-basis: auto !important;
  }
  [container] {
    min-width: 300px;
    flex: 0 !important;
  }
  /* [container] {
    background-image: url('/assets/frames/frame0.png');
    background-position: 16px 12px;
    background-repeat: no-repeat;
    background-size: 90% 90%;
  } */
  [capsule] {
    margin: 4px; 
    padding: 4px; 
    overflow: hidden; 
    border-radius: 6px;
    border-width: var(--border-size-1); 
    border: 2px solid var(--xcolor-three);
    /* background-color: var(--xcolor-one);  */
    /* color: var(--xcolor-three); */
    font-size: var(--font-size-0);  
  }
  [capsule][selected] {
    box-shadow: var(--shadow-hover);
    /* background: var(--xcolor-two); */
    background-color: var(--xcolor-one);
    border: 2px solid var(--xcolor-brand);
    color: var(--xcolor-four);
    font-weight: bold;
  }
  fancy-input {
    display: inline-block; 
    width: 100%; 
    border: none;
  }
  label {
    padding-right: 0.2em;
    font-size: 0.9em;
  }
  img {
    border-radius: 32px;
    width: 32px;
    height: 32px;
    /* padding-right: 0.1em; */
    border: 2px solid transparent;
  }
  [selected] img {
    border-color: var(--xcolor-brand) ;
  }
  [name] {
    font-size: 1.2em;
  }
  [owner] {
    font-size: 0.7em;
  }
  [timestamp] {
    font-size: 0.7em;
  }
  [description] {
    font-style: italic;
    font-size: 0.7em;
    padding-right: 4px;
    width: 100%;
  }
  [default-aligned] {
    justify-content: left;
    align-items: stretch;
    text-align: left;
  }
  icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  icon:hover {
    color: var(--xcolor-four);
  }
  spacer {
    display: inline-block;
    width: 4px;
    height: 12px;
  }
  slot::slotted(*) {
    flex: 1;
    width: auto !important;
  }
  [name="settings"]::slotted(*) {
    background: var(--xcolor-two);
  }
  [name="toolbar"]::slotted(*) {
    padding: var(--size-1);
    font-size: var(--font-size-4);
    height: auto;
  }
</style>

<div hidden="{{readonly}}">
  <slot name="toolbar"></slot>
  <slot name="settings"></slot>
</div>

<div flex column>
  <div flex scrolling grid repeat="graph_t">{{graphItems}}</div>
</div>

<template graph_t>
  <div container>
    <div capsule value="{{id}}" selected$="{{selected}}" on-click="onEvent" key="Select Graph">
      <div hidden="{{readonly}}" bar>
        <span flex>
          <fancy-input name xautofocus="{{selected}}" disabled="{{isPublic}}" key="{{id}}" value="{{id}}" on-change="onRename" on-click="donothing"></fancy-input>
        </span>
        <icon on-click="onEvent" key="Publish Graph" value="{{id}}" hidden="{{hidePublish}}">public</icon>
        <icon on-click="onEvent" key="Unpublish Graph" value="{{id}}" hidden="{{hideUnpublish}}">shield_lock</icon>
        <icon on-click="onEvent" key="Clone Graph" value="{{id}}">content_copy</icon>
        <icon on-click="onEvent" key="Delete Graph" value="{{id}}" hidden="{{isPublic}}">delete</icon>
        <div>&nbsp;&nbsp;</div>
      </div>
      <div style="font-size: var(--font-size-1); line-height: 80%;">
        <!-- Support multiline in fancy-input? -->
        <fancy-input description disabled="{{isPublic}}" key="{{id}}" value="{{description}}" on-change="onDescribe" on-click="donothing"></fancy-input>
      </div>
      <div bar style="order: 3; line-height: 80%; padding: 8px;">
        <span owner flex><span hide$="{{hideOwner}}">{{owner}}</span></span>
        <span timestamp>{{timestamp}}</span>
      </div>
    </div>
  <div>
</template>
`
});
