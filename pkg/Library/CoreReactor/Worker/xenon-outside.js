/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const configureApi = terminal => {
  return {
    industrialize: async () => {
      await terminal.call({method: 'industrialize'});
    },
    emitter(name, spec) {
      return createAtom(terminal, name, spec);
    }
  };
};

const createAtom = async (terminal, name, spec) => {
  // wait for completion
  const log = logf(`Host:${name}`, '#4d004d');
  if (!spec ?? !spec.type) {
    throw('malformed atom spec:' + JSON.stringify(spec));
  }
  log(`creating...`); 
  await terminal.call({method: 'createAtom', args: {name, spec}});
  // return Host facade
  const host = {        
    isXHost: true,
    name,
    log,
    handlers: {},
    async dispose() {
      this.log('dispose', name); 
      this.cleanRender();
      this.unlistenAll();
      return terminal.call({method: 'host_dispose', args: {name}});
    },
    async hasTemplate() {
      return terminal.call({method: 'host_hasTemplate', args: {name}});
    },
    invalidate() {
      terminal.send({method: 'host_invalidate', args: {name}});
    },
    set inputs(inputs) {
      Object.assign((this.latentInputs??={}), inputs);
      setTimeout(() => {
        if (this.latentInputs) {
          terminal.send({method: 'host_setInputs', args: {name, inputs: this.latentInputs}});
          this.latentInputs = null;
        }
      });
    },
    listen(name, callback) {
      const handlers = (this.handlers[name] ??= []);
      handlers.push(callback);
    },
    createEventListener() {
      this.listener(
        async envelope => {
          const jobs = this.handlers[envelope?.kind]?.map(h => h(envelope));
          if (jobs) {
            const values = await Promise.all(jobs);
            return values?.length === 1 ? values[0] : values;
          }
        }
      );
    },
    listener(callback, other) {
      if (typeof callback !== 'function') {
        return this.onevent(callback, other);
      }
      const watcher = async msg => {
        if (msg.name === name) {
          const result = await callback(msg);
          terminal.send({result, vibeId: msg.vibeId});
        }
      }
      terminal.watch(watcher);
      this.watchers = [...(this.watchers ?? []), watcher]; 
    },
    unlistenAll() {
      this.watchers?.forEach(watcher => terminal.unwatch(watcher));
      this.watchers = null;
    },
    handleEvent(eventlet) {
      terminal.send({method: 'host_handleEvent', args: {name, eventlet}});
    },
    cleanRender() {
      const packet = {id: name, container: spec.container, content: {model: {$clear: true}}};
      const envelope = {name, kind: 'render', packet};
      this.watchers?.forEach(w => w(envelope)); 
    }
  };
  host.createEventListener();
  return host;
}