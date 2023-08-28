/**
 * @module Bus
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const log = logf('MessageBus', 'olive');

let _vibeId = Math.floor(Math.random()*1e2)*1e3;

export const MessageBus = class {
  constructor(connection) {
    this.id = Math.floor(Math.random()*90) + 10;
    this.connection = connection;
    connection.addEventListener('error', e => log.error('worker failed to load'));
    log('Bus', this.id, 'in service');
  }
  dispose() {
    //
  }
  sendVibration(msg) {
    //log(this.id, `sending`, msg);
    return this.postMessage(msg);
  }
  postMessage(msg) {
    try {
      this.connection.postMessage(msg);
      return msg?.vibeId;
    } catch(x) {
      log.error(msg);
      log.error(x);
    }
  }
  requestId(msg) {
    if (typeof msg === 'object') {
      msg.vibeId = msg.vibeId ?? `${this.id}:${_vibeId++}`;
      _vibeId = _vibeId % 1e7;
      return msg.vibeId;
    }
  }
  receiveVibrations(handler) {
    this.listener = /*async*/ msg => {
      // TODO(sjmiles): hack impedance mismatch in 'msg' ... ?
      const data = (msg.type === 'message') ? msg.data : msg;
      //log(this.id, `receiving`, data);
      handler(data);
    };
    this.connection.addEventListener('message', this.listener);
  }
};