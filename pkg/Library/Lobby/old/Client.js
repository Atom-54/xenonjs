/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
({
  getPersona(profile) {
    return profile?.displayName;
  },
  shouldUpdate({group, profile}) {
    return group && this.getPersona(profile);
  },
  async update({group, profile, stream}, state, {service, invalidate}) {
    const clientService = async (msg, data) => 
      await service({kind: 'ClientService', msg, data});
    const persona = this.getPersona(profile);
    if (persona) {
      if (!state.client) {
        state.client = await clientService('createClient', {persona});
      }
      timeout(invalidate, 10*1e3);
      const {client} = state;
      if (group && client) {
        state.streams = await clientService('meet', {persona, group, stream, client});
        //return this.getOutputTranche(state.streams);
      }
    }
  },
  async updateStreams({group, returnStream}, {streams, lobby, persona}, {service}) {
    const newStreams = await service({kind: 'LobbyService', msg: 'meetStrangers', data: {lobby, persona, group, returnStream}});
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
  // render({group, profile}, {streams}) {
  //   const tvs = values(streams || {}).map(({stream, meta: {name}}) => ({stream, name})).reverse();
  //   const persona = this.getPersona(profile);
  //   return {
  //     group,
  //     name: persona || '...',
  //     tvs
  //   };
  // },
  // onCloseClick({eventlet: {key}}, {streams}) {
  //   const index = streams.findIndex(s => s?.meta?.name === key);
  //   if (index >= 0) {
  //     streams.splice(index, 1);
  //   }
  // },
/*
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
  <span>{{name}}</span>'s Communicator: <i>{{group}}</i>
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
*/
});
