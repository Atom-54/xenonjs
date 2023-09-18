/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Binder from './Binder.js';
import * as Graphs from './Graphs.js';
import * as Layers from './Layers.js';
import * as Id from './Id.js';
import {assign, entries, create, keys, map, nob, values} from '../Reactor/safe-object.js';
import {deepEqual} from '../Reactor/Atomic/js/utils/object.js';

globalThis.html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();

// better than bad, it's good! it's log!
const log = logf('App', 'purple');
//logf.flags.App = true;

globalThis.layers = create(null);

// init the app with Atom industry `atomEmitter`
export const createLayer = async (graph, atomEmitter, Composer, services, name='') => {
  log(`createLayer "${name}"`);
  // union graphs if provided more than one
  if (Array.isArray(graph)) {
    graph = Graphs.union(graph);
  }
  // make a composer right away
  // TODO(sjmiles): Composer.options is a static value used by Composer.createComposer 
  // when we go asynchronous, we lose provenance over this value that may have been
  // set by caller of createLayer
  const composer = Composer?.createComposer(); 
  // make a graph layer
  const layer = await Layers.reifyGraphLayer(graph, atomEmitter, composer, services, name);
  composer.onevent = (atomName, event) => handleAtomEvent(layer, atomName, event);
  // connect Atoms to app listeners
  connectAtoms(layer);
  // strobe for rendering
  await Layers.invalidate(layer);
  // all done
  return layer;
};

export const handleAtomEvent = (layer, name, event) => {
  log('handleAtomEvent', name, event);
  layer.atoms[name]?.handleEvent(event);
};

const connectServices = (layer, services) => {
  layer.services = services ?? {};
};

// connect Atoms to app listeners
export const connectAtoms = (layer) => {
  map(layer.atoms, (name, atom) => {
    // TODO(sjmiles): worker output is output.output :( won't work right now
    atom.listen('output', output => atomOutput(layer, name, atom, /*output?.output ??*/ deepCopy(output)));
    atom.listen('render', packet => atomRender(layer, name, atom, packet?.packet ?? packet));
    atom.listen('service', request => atomService(layer, name, atom, request));
  }); 
};

export const obliterateLayer = layer => {
  // dispose Atoms
  Layers.obliterateGraphLayer(layer);
  // remove state data
  clearData(layer);
};

// push static layer data into the data stream
export const initializeData = async (layer, persistedState) => {
  // get initial graph data
  const data = await Layers.initializeData(layer);
  assign(data, persistedState)
  // apply it to Atoms
  return setData(layer, data);
};

export const clearData = (layer, atomIds) => {
  const ob = layer.bindings.outputBindings;
  const getAtomPropKeys = atomId => keys(ob[atomId]).map(key => Id.qualifyId(atomId, key));
  const ids = atomIds ?? keys(layer.atoms);
  const props = ids.flatMap(atomId => getAtomPropKeys(atomId));
  const nullify = nob();
  props.forEach(key => nullify[key] = null);
  log('clearData built nullification object:', nullify);
  setData(layer, nullify);
};

export const get = (layer, scopedKey) => {
  log('get', scopedKey);
  return layer.flan.state[scopedKey];
};

export const set = (layer, scopedKey, value) => {
  log('set', scopedKey, value);
  forwardBoundInput(layer, {[scopedKey]: value});
};

export const setUnscoped = (layer, key, value) => {
  const scopedKey = Id.qualifyId(layer.name, key);
  return set(layer, scopedKey, value);
};

export const setData = async (layer, data) => {
  forwardBoundInput(layer, data);
};

const atomRender = ({composer, system}, atomName, atom, packet) => {
  if (composer && packet) {
    packet.container = system[atomName]?.container ?? packet.container;
    composer.render(packet);
  }
};

const atomOutput = (layer, atomName, atom, output) => {
  if (keys(output).length) {
    log('atomOutput', atomName, output);
    //layer.onoutput?.(layer, atomName, atom, output);
    forwardBoundOutput(layer, atomName, output);
  }
};

const forwardBoundOutput = (layer, atomName, output) => {
  // translate atom output through outputBindings to create boundInput
  const boundInput = Binder.processOutput(atomName, output, layer.bindings.outputBindings);
  // feed bindings back as boundInput
  forwardBoundInput(layer, boundInput);
};

const forwardBoundInput = (layer, scopedInput) => {
  // remove output that is unchanged from state
  const dirtyInput = dirtyCheck(layer.flan.state, scopedInput);
  //log('assigning dirtyInput:', dirtyInput);
  // if there is any...
  if (keys(dirtyInput).length) {
    // drop input into state
    assign(layer.flan.state, dirtyInput);
    // allow layer to intervene
    layer.onvalue?.(dirtyInput);
    // send bound inputs to Atoms
    layer.flan.forwardStateChanges(dirtyInput);
  }
};

export const dirtyCheck = (state, data) => {
  const dirty = create(null);
  const clean = create(null);
  entries(data).forEach(([key, value]) => {
    if (!deepEqual(value, state[key])) {
      dirty[key] = value;
    }
    else {
      clean[key] = value;
    }
  });
  if (keys(clean).length) {
    //log.warn('ignoring clean values:', clean);
  }
  return dirty;
};

// push static layer data into the data stream
export const setAtomsData = async (layer, atomIds) => {
  // get graph data
  const data = await Layers.initializeData(layer);
  // apply it to atomIds
  const boundInput = Binder.processInput(data, layer.bindings.inputBindings);
  boundInput.forEach(({id, inputs}) => {
    if (atomIds.find(atomId => atomId === id) && layer.atoms[id]) {
      layer.atoms[id].inputs = inputs;
    }
  });
};

const atomService = async (layer, atomName, atom, {kind, service, msg, data, resolve}) => {
  const value = await atomServiceHandler(layer, atomName, atom, service || kind, msg, data);
  if (resolve) {
    resolve(value);
  }
  return value;
};

const atomServiceHandler = async (layer, atomName, atom, serviceName, methodName, data) => {
  log.group/*Collapsed*/('atomServiceHandler', serviceName, methodName, data ?? '');
  try {
    const finish = value => {
      if (value !== undefined) {
        log(methodName, 'says', value);
      }
      return value;
    };
    const service = layer.services[serviceName];
    if (service) {
      const task = service[methodName];
      if (task) {
        return finish(await task(layer, atom, data));
      } else {
        log.warn(methodName, 'not available in', serviceName);
      }
      return;
    }
    switch (serviceName) {
      case 'SystemService': {
        switch (methodName) {
          case 'request-context': 
            const layers = {};
            map(layer.flan.state, (key, value) => (layers[Id.sliceId(key, 0, 1)] ??= {})[Id.sliceId(key, 1)] = value);
            const context = {
              layers,
              logs: [] //logf.get()
            }
            return finish(context);
          case 'setResource': 
            return Resources.set(data.id, data.resource)
        }
      }
      case 'StateService': {
        const key = Id.qualifyId(layer.name, data.stateKey);
        switch (methodName) {
          case 'GetStateValue': 
            return finish(get(layer, key));
          case 'SetStateValue':
            return finish(set(layer, key, data.value));
        }
      }
    }
    log.warn(`found no matching service for ${serviceName}:${methodName}`);
  } finally {
    log.groupEnd();
  }
};

// sometimes needed to un-stall asynchronous tasks
// that become disabled between requests on certain
// edge/serverless platforms
export const {revalidate} = Layers;
