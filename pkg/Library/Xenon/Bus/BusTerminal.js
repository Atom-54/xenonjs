/**
 * @module Bus
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {MessageBus} from './MessageBus.js';

const log = logf('BusTerminal', 'Chartreuse', 'black');

export const BusTerminal = class {
  constructor(connection) {
    // watchers see everything received
    this.watchers = [];
    // lobby patrons are waiting for a certain vibe
    this.lobby = {};
    // get an actual bus
    this.bus = new MessageBus(connection);
    // receive vibes from the bus
    this.bus.receiveVibrations(vibe => this._receive(vibe));
  }
  // watchers see everything received
  async watch(watcher) {
    this.watchers.push(watcher);
  }
  async unwatch(watcher) {
    const i = this.watchers.indexOf(watcher);
    if (i >= 0) {
      this.watchers.splice(i, 1);
    }
  }
  // simply send the vibe
  send(vibe) {
    log(this.bus.id, 'send vibe');
    return this.bus.sendVibration(vibe);
  }
  // send a vibe, and wait for a return value
  async call(vibe) {
    this.bus.requestId(vibe);
    // log('need return value, requested vibeId, got', vibe.vibeId);
    this.send(vibe);
    if (vibe.vibeId) {
      log(`creating Promise for [${vibe.vibeId}]`);
      return this._waitForVibe(vibe.vibeId);
    }
  }
  // create a promise that resolves when vibeId is received
  _waitForVibe(vibeId) {
    return new Promise(resolve => {
      const queue = this.lobby[vibeId] ?? (this.lobby[vibeId] = []);
      queue.push(resolve);
    });
  }
  _receive(vibe) {
    log(this.bus.id, 'receive vibe', vibe);
    // if message is for folks in the lobby
    if (typeof vibe === 'object') {
      const {vibeId} = vibe;
      let value = vibe.result ?? vibe.value;
      // if (vibe.kind === 'return') {
      //   value = vibe.value;
      // }
      // queue of listeners waiting for vibeId
      const queue = this.lobby[vibeId];
      if (queue) {
        log(`resolving Promises for [${vibeId}] with:`, value);
        // queue is emptied for service
        this.lobby[vibeId] = null;
        // service the queue
        queue?.forEach(r => r(value));
        return;
      }
    }
    // dispatch to watchers
    this.watchers?.forEach(watch => watch(vibe));
    // send it to the general handler
    // if (this.onmessage) {
    //   this.onmessage(vibe);
    // }
  }
};
