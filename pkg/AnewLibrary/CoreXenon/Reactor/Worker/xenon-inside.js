/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const log = globalThis.logf('WorkerTransit', 'LightSalmon', 'black');

// returned object receives messages from environment and implements them
export const configureApi = (xenon, terminal) => {
  // return api
  const api = {
    hosts: {},
    ready() {
      terminal.send({kind: 'ready'});
    },
    async industrialize() {
      return xenon.industrialize();
    },
    async setPaths({paths}) {
      paths.$anewLibrary = Paths.map.$anewLibrary;
      Paths.map = paths;
    },
    async setAtomOptions(options) {
      log('setAtomOptions', options);
      xenon.AtomFactory.atomOptions = options;
    },
    async createAtom({name, spec}) {
      // make an atom
      //const host = await xenon.AtomFactory.createAtom(name, spec);    
      const host = await xenon.emitter(name, spec);
      // bookkeeping
      api.hosts[name] = host;
      // sanity
      if (host) {
        // three channels: service, output, render
        // service channel is full duplex
        host.listen('service', request => this.service(name, request));
        // these are purely output channels
        host.listen('output', o => this.forward(name, 'output', {output: o}));
        host.listen('render', p => this.forward(name, 'render', {packet: p}));
        return name;    
      }
    },
    async service(name, request) {
      log('service request', request);
      const {kind: service, msg, data} = request;
      const result = await terminal.call({name, kind: 'service', service, msg, data});
      request.resolve(result);
    },
    forward(name, kind, msg) {
      terminal.send({name, kind, ...msg});
    },
    host_dispose({name}) {
      api.hosts[name] = null;
    },
    host_invalidate({name}) {
      api.hosts[name]?.invalidate();
    },
    host_hasTemplate({name}) {
      return api.hosts[name]?.hasTemplate();
    },
    async host_setInputs({name, inputs}) {
      const host = api.hosts[name];
      if (host) {
        host.inputs = inputs;
      }
    },
    host_handleEvent({name, eventlet}) {
      const host = api.hosts[name];
      if (host) {
        host.handleEvent(eventlet);
      }
    }
  };
  //
  terminal.watch(async vibe => {
    const {vibeId, method, args} = vibe ?? 0;
    if (api[method]) {
      log('wait for', vibe);
      const value = await api[method](args);
      if (vibeId) {
        terminal.send({vibeId, kind: 'return', value});
      }
    }
  });
  //
  return api;
};