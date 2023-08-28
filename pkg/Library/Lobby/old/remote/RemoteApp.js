/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
import {
  App, Resources, makeName, logFactory,
  subscribeToStream, tryst, Myself
} from '../conf/allowlist.js';
import {RemoteRecipe} from './RemoteRecipe.js';

const log = logFactory(true, 'RemoteApp', 'yellow', 'navy');

// App class
export const RemoteApp = class extends App {
  constructor(paths, root, options) {
    super(paths, root);
    this.userAssembly = [RemoteRecipe];
  }
  async spinup(user, group) {
    await super.spinup();
    await this.initRtc();
    await this.initPersona(user);
    await this.initLobby(group);
    await this.runLobby();
  }
  async initPersona(user) {
    this.persona = user || makeName();
    this.arcs.set('user', 'persona', this.persona);
  }
  async initRtc() {
    this.myself = new Myself();
    this.myself.onstream = this.onstream.bind(this);
    subscribeToStream('default', stream => this.myself.mediaStream = stream);
    await this.myself.ready;
  }
  async initLobby(group) {
    this.group = group || 'frankincense';
    this.arcs.set('user', 'group', this.group);
    this.arcs.watch('user', 'group', group => this.group = group);
  }
  async runLobby() {
    this.meet(this.persona, this.myself.peerId, 3000);
  }
  async meet(name, peerId, pingIntervalMs) {
    if (!this.closed) {
      setTimeout(() => this.runLobby(), pingIntervalMs || 1e5);
      this.myself.name = this.persona;
      const strangers = await tryst.meetStrangers(this.group, null, {persona: name, peerId}) || {};
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
    console.warn(id, stream.getAudioTracks());
    this.arcs.set('user', 'remoteStream', id);
  }
  createTvParticle(name, container, stream) {
    const meta = {kind: '$library/Media/InputCamera', container, staticInputs: {stream}};
    this.arcs.createParticle(name, 'user', meta);
  }
};