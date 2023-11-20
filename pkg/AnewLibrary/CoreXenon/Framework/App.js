/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Id from './Id.js';
import * as Graphs from './Graphs.js';
import * as Layers from './Layers.js';
import * as Flan from './Flan.js';
import {keys, map} from '../Reactor/safe-object.js';

globalThis.html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();

// better than bad, it's good! it's log!
const log = logf('App', 'purple');
//logf.flags.App = true;

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
  // connect Atoms to app listeners
  connectAtoms(layer);
  composer.onevent = (atomName, event) => handleAtomEvent(layer, atomName, event);
  // strobe for rendering
  await Layers.invalidate(layer);
  // all done
  return layer;
};

// connect Atoms to app listeners
export const connectAtoms = (layer, atoms) => {
  map(atoms || layer.atoms, (name, atom) => {
    // TODO(sjmiles): worker output is output.output :( won't work right now
    atom.listen('output', output => atomOutput(layer, atom.name, atom, /*output?.output ??*/ output));
    atom.listen('render', packet => atomRender(layer, atom.name, atom, packet?.packet ?? packet));
    atom.listen('service', request => atomService(layer, atom.name, atom, request));
  }); 
};

export const handleAtomEvent = (layer, name, event) => {
  log('handleAtomEvent', name, event);
  layer.atoms[name]?.handleEvent(event);
};

export const obliterateLayer = async layer => {
  // dispose Atoms
  await Layers.obliterateGraphLayer(layer);
  // remove state data
  Flan.obliterateData(layer)
};

const atomRender = ({composer, composer2, system}, atomName, atom, packet) => {
  if (packet) {
    packet.container = system[atomName]?.container ?? packet.container;
    composer?.render(packet);
    composer2?.render(packet);
  }
};

const atomOutput = (layer, atomName, atom, output) => {
  if (keys(output).length) {
    log('atomOutput', atomName, output);
    //layer.onoutput?.(layer, atomName, atom, output);
    Flan.forwardBoundOutput(layer, atomName, output);
  }
};

const atomService = async (layer, atomName, atom, {kind, service, msg, data, resolve}) => {
  const value = await atomServiceHandler(layer, atomName, atom, service || kind, msg, data);
  if (resolve) {
    resolve(value);
  }
  return value;
};

const atomServiceHandler = async (layer, atomName, atom, serviceName, methodName, data) => {
  //const services = [...layer.services, ...AppServices];
  const services = assign({}, layer.services, AppServices);
  log.group/*Collapsed*/('atomServiceHandler', serviceName, methodName, data ?? '');
  try {
    const service =services[serviceName];
    if (service) {
      const task = service[methodName];
      if (task) {
        const finish = value => {
          if (value !== undefined) {
            log(methodName, 'says', value);
          }
          return value;
        };
        return finish(await task(layer, atom, data));
      } else {
        log.warn(methodName, 'not available in', serviceName);
      }
    } else {
      log.warn(`found no matching service for ${serviceName}:${methodName}`);
    }
  } finally {
    log.groupEnd();
  }
};

const AppServices = {
  StateService: {
    GetStateValue(layer, atom, data) {
      const key = Id.qualifyId(layer.name, data.stateKey);
      return Flan.get(layer, key);
    },
    SetStateValue(layer, atom, data) {
      const key = Id.qualifyId(layer.name, data.stateKey);
      return Flan.set(layer, key, data.value);
    }
  },
  SystemService: {
    'request-context'(layer, atom, data) {
      const layers = {};
      map(layer.flan.state, (key, value) => (layers[Id.sliceId(key, 0, 1)] ??= {})[Id.sliceId(key, 1)] = value);
      const context = {
        layers,
        logs: [] //logf.get()
      }
      return context;
    },
    setResource(layer, atom, data) {
      return Resources.set(data.id, data.resource)
    },
    GetNodeTypes(layer, atom, data) {
      return layer.flan.library.nodeTypes;
    }
  }
};

// sometimes needed to un-stall asynchronous tasks
// that become disabled between requests on certain
// edge/serverless platforms
export const {revalidate} = Layers;
