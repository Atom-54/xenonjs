/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {Myself} from './Myself.js';
import {Resources} from '../App/Resources.js';
import * as tryst from '../PubSub/Firebase/tryst.js';
import {logFactory, makeName} from '../Core/utils.js';

// import {
//   App, Resources, makeName, logFactory,
//   subscribeToStream, tryst, Myself
// } from '../conf/allowlist.js';
// import {RemoteRecipe} from './RemoteRecipe.js';

const log = logFactory(logFactory.flags.rtc, 'ClientService', '#333', 'lightblue');

const Client = class {
  constructor(persona) {
    this.allStreams = [];
    this.streams = [];
    this.myself = new Myself();
    this.myself.name = persona;
    this.myself.onstream = this.onstream.bind(this);
    this.ready = false;
    (async () => {
      await this.myself.ready;
      log(`(Rtc)Client for [${persona}] is ready`);
      this.ready = true;
    })();
  }
  async meet(groupId, returnStream) {
    const stream = Resources.get(returnStream?.id);
    //log('meet stream is', stream);
    if (stream && this.ready) {
      this.myself.mediaStream = stream;
      log(`publishing ${this.myself.name} stream to ${groupId}...`);
      this._meet(groupId, this.myself.peerId, 3000);
    }
  }
  async _meet(groupId, peerId, pingIntervalMs) {
    if (!this.closed) {
      //setTimeout(() => this._meet(), pingIntervalMs || 1e5);
      const strangers = await tryst.meetStrangers(groupId, null, 
        {persona: this.myself.name, peerId}) || {};
      Object.values(strangers).forEach(({persona, peerId}) => {
        if (this.myself.shouldCall(peerId)) {
          log('CALLING', persona);
          this.myself.doCall(peerId);
        }
      });
    }
  }
  onstream(stream, meta) {
    log('onstream', meta);
    const id = meta?.id || makeName();
    Resources.set(id, stream);
    log.warn(id, stream.getAudioTracks());
    // push this onto a list of streams
    //this.arcs.set('user', 'remoteStream', id);
  }
};

export const ClientService = {
  createClient({persona}) {
    return Resources.allocate(new Client(persona));
  },
  async disposeClient(clientId) {
    const client = Resources.get(clientId);
    if (client) {
      client.closed = true;
      Resources.free(clientId);
    }
  },
  async meet({client: clientId, group: groupId, stream: returnStream}) {
    const client = Resources.get(clientId);
    if (client) {
      return client.meet(groupId, returnStream);
    } else {
      log(`{$clientId} is not (yet) a client`);
    }
  }
};