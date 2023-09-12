/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Binder from './Binder.js';
import * as Graphs from './Graphs.js';
import * as Layers from './Layers.js';
import * as Id from './Id.js';
import {SafeObject} from '../CoreReactor/safe-object.js';
import {deepEqual} from '../CoreReactor/Atomic/js/utils/object.js';

globalThis.html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();

const {assign, entries, create, keys, map, nob, values} = SafeObject;

// better than bad, it's good! it's log!
const log = logf('App', 'purple');
//logf.flags.App = true;

globalThis.layers = create(null);

// init the app with Atom industry `atomEmitter`
export const createLayer = async (graph, atomEmitter, Composer, Services, name='') => {
  // absorb n graphs
  if (Array.isArray(graph)) {
    graph = Graphs.union(graph);
  }
  // make a composer right away
  // TODO(sjmiles): Composer.options is a static value used by Composer.createComposer 
  // if we go asynchronous, we lose provenance over this value
  let layer;
  const onevent = (name, event) => onComposerEvent(layer, name, event);
  const composer = Composer?.createComposer(onevent); 
  // make a live graph layer
  layer = await Layers.reifyGraphLayer(graph, atomEmitter, name);
  layer.composer = composer;
  // connect Atoms to app listeners
  connectAtoms(layer, layer.atoms);
  // bind services
  connectServices(layer, Services);
  // strobe for rendering
  Layers.invalidate(layer);
  // bookkeep
  globalThis.layers[name || 'base'] = layer;
  return layer;
};

export const obliterateLayer = layer => {
  // dispose Atoms
  Layers.obliterateGraphLayer(layer);
  // remove state data
  clearData(layer);
};

export const onComposerEvent = (layer, name, event) => {
  log('onComposerEvent', name, event);
  layer.atoms[name]?.handleEvent(event);
};

// push static layer data into the data stream
export const initializeData = async layer => {
  // get initial graph data
  const data = await Layers.initializeData(layer);
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
  setData(nullify);
};

export const get = (layer, scopedKey) => {
  log('get', scopedKey);
  return layer.flan.state[scopedKey];
};

export const set = (layer, scopedKey, value) => {
  log('set', scopedKey, value);
  forwardBoundInput(layer, {[scopedKey]: value});
};

export const setData = async (layer, data) => {
  forwardBoundInput(layer, data);
};

// connect Atoms to app listeners
export const connectAtoms = (layer, atoms) => {
  map(atoms, (name, atom) => {
    atom.listen('output', ({output}) => atomOutput(layer, name, atom, output));
    atom.listen('render', (packet) => atomRender(layer, name, atom, packet?.packet ?? packet));
    atom.listen('service', ({kind, service, msg, data}) => atomService(layer, name, atom, service || kind, msg, data));
  }); 
};

const atomRender = ({composer, system}, atomName, atom, packet) => {
  if (composer && packet) {
    packet.container = system[atomName]?.container ?? packet.container;
    composer.render(packet);
  }
};

const atomOutput = (layer, atomName, atom, output) => {
  if (keys(output).length) {
    log('onOutputEvent', atomName, output);
    layer.onoutput?.(layer, atomName, atom, output);
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
  // rmove output that is unchanged from state
  const dirtyInput = dirtyCheck(layer.flan.state, scopedInput);
  //log.warn('assigning dirtyInput:', dirtyInput);
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

const connectServices = (layer, Services) => {
  layer.services = {...(Services??0)};
};

const atomService = async (layer, atomName, atom, serviceName, methodName, data) => {
  log.group('onServiceEvent', serviceName, methodName, data ?? '');
  try {
    const finish = value => {
      if (value !== undefined) {
        log(methodName, 'says', value);
      }
      return value;
    };
    const service = (globalThis.layers.base.services || layer.services)[serviceName];
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
            map(globalThis.layers, (key, value) => layers[key] = value.state);
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
