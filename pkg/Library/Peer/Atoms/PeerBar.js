export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({peers, staticPeers}, state, {}) {
  const all = [...(peers??[]), ...(staticPeers??[])];
  all.forEach((p, i) => {
    p.key = i;
  });
  state.peers = all;
  return {peers: all, selectedPeer: state.peers[state.selected||0]};
},
render({}, {peers, selected}) {
  peers.forEach((p, i) => {
    p.selected = (i===(selected??0));
  });
  return {
    peers
  };
},
onPeerClick({eventlet: {key}}, state) {
  state.selected = Number(key);
  return {selectedPeer: state.peers[state.selected]};
},
template: html`
<style>
  :host {
    background-color: var(--xcolor-one);
    color: var(--xcolor-three);
    padding: 4px 8px;
  }
  [row]:hover {
    background-color: var(--xcolor-two);
    color: var(--xcolor-three);
  }
  [row][selected] {
    background-color: var(--xcolor-three);
    color: var(--xcolor-one);
  }
  [row] {
    padding: 8px;
    white-space: nowrap;
    text-align: left;
    border-radius: 4px;
    margin: 1px;
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid black;
  }
</style>
<div flex column repeat="peer_t">{{peers}}</div>
<template peer_t>
  <div center row key$="{{key}}" selected$="{{selected}}" on-click="onPeerClick">
    <img src="{{photoURL}}" referrerpolicy="no-referrer">&nbsp;
    <span flex>{{name}}</span>
  </div>
</template>
`
});
