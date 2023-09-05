/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

({
  async initialize({}, state, {service}) {
    state.lobby = await service({kind: 'LobbyService', msg: 'createLobby'});
  },
  getPersona(profile) {
    return profile?.displayName;
  },
  shouldUpdate({group, profile}) {
    return group && this.getPersona(profile);
  },
  async update({group, profile, returnStream}, state, {service, invalidate}) {
    state.persona = this.getPersona(profile);
    if (state.persona) {
      timeout(invalidate, 10*1e3);
      state.streams = await this.updateStreams({group, returnStream}, state, {service});
      return this.getOutputTranche(state.streams);
    }
  },
  async updateStreams({group, returnStream}, {streams, lobby, persona}, {service}) {
    const newStreams = await service({
      kind: 'LobbyService', 
      msg: 'meetStrangers', 
      data: {lobby, group, persona, returnStream}
    });
    streams = [
      ...(streams || []),
      ...(newStreams || [])
    ];
    return streams;
  },
  getOutputTranche(streams) {
    const tranche = streams.length > 4 ? streams.slice(0, -4) : streams;
    return {
      stream: tranche[0]?.stream,
      stream2: tranche[1]?.stream,
      stream3: tranche[2]?.stream,
      stream4: tranche[3]?.stream
    };
  },
  render({group}, {persona, streams}) {
    const tvs = values(streams || {}).map(({stream, meta: {name}}) => ({stream, name})).reverse();
    return {
      group,
      name: persona || '...',
      tvs
    };
  },
  onCloseClick({eventlet: {key}}, state) {
    const index = state.streams.findIndex(s => s?.meta?.name === key);
    if (index >= 0) {
      state.streams.splice(index, 1);
    }
  },
  template: html`
<style>
  :host {
    padding: 8px;
    background: gray;
    color: #eee;
  }
  hr {
    width: 100%;
  }
  [label2] {
    font-size: 0.8em;
  }
  [strangers] {
    padding: 4px;
    font-family: "Google Sans", sans-serif;
  }
  [stream] {
    width: 24%;
    margin: 4px;
  }
  [name] {
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

<div>
  <span>{{name}}</span>'s Lobby: <i>{{group}}</i>
</div>
<hr>
<div tvs flex scrolling row repeat="video_t">{{tvs}}</div>

<template video_t>
  <div stream column>
    <div bar>
      <span name>{{name}}</span>
      <span flex></span>
      <icon key="{{name}}" on-click="onCloseClick">close</icon>
    </div>
    <stream-view flex playsinline muted stream="{{stream}}"></stream-view>
  </div>
</template>
`
});
