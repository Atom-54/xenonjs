/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {Myself} from './Myself.js';
import {Resources} from '../App/Resources.js';
import * as tryst from '../PubSub/Firebase/tryst.js';
import {logFactory} from '../Core/utils.js';

const log = logFactory(logFactory.flags.rtc, 'LobbyService', 'lightblue', '#333');

const Lobby = class {
  constructor() {
    this.allStreams = [];
    this.streams = [];
    this.myself = new Myself();
  }
  async meetStrangers(group, persona, returnStream) {
    await this.myself.ready;
    this.myself.name = persona;
    this.myself.mediaStream = Resources.get(returnStream);
    this.myself.onstream = this.onstream.bind(this);
    //log(persona, returnStream);
    const {peerId} = this.myself;
    if (peerId) {
      // be present at the meeting place
      await tryst.meetStrangers(group || 'open', persona, {persona, peerId});
      // these are the streams we captured since last time
      const {streams} = this;
      // start fresh
      this.streams = [];
      // collect all the streams
      this.allStreams = [...this.allStreams, ...streams];
      // try some callbacks
      this.allStreams.forEach(stream => this.maybeTryBack(stream));
      // return the streams
      return streams;
    }
  }
  maybeTryBack(stream) {
    const them = stream?.meta?.call;
    //log('maybeTryBack', them);
    if (this.myself.shouldCall(them)) {
      log('CALLING', them);
      this.myself.doCall(them);
    }
  }
  onstream(stream, meta) {
    if (stream && meta.id) {
      // create a resource id for this stream
      this.streamId = `${meta.id}-lobby-stream`;
      // stash our stream there
      Resources.set(this.streamId, stream);
      // remember this stream when asked
      const info = {stream: this.streamId, meta: {name: meta.id, ...meta}};
      this.streams.push(info);
      // what we found
      log(info);
    }
  }
};

export const LobbyService = {
  createLobby() {
    const lobbyId = Resources.allocate(new Lobby());
    log('created lobby', lobbyId);
    return lobbyId;
  },
  async meetStrangers({lobby, group, persona, returnStream}) {
    const realLobby = Resources.get(lobby);
    if (realLobby) {
      return realLobby.meetStrangers(group, persona, returnStream);
    } else {
      log(`lobby "${lobby}" doesn't exist yet`);
    }
  }
};