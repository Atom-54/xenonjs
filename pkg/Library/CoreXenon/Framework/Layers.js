/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Id from './Id.js';
import * as Graphs from './Graphs.js';
import * as Binder from './Binder.js';
import {keys, values, entries, assign, map} from '../Reactor/safe-object.js';
import {deepCopy} from '../Reactor/Atomic/js/utils/object.js';

const log = logf('Layers', '#8f43ee');

// make a Graph into a Layer
export const reifyGraphLayer = async (graph, emit, composer, services, name='') => {
  // combine atom specs from all nodes into one 'system'
  const system = await Graphs.graphToAtomSpecs(graph, name);
  // make real atoms from specs
  const atoms = await reifyAtoms(system, emit);
  // bind
  const bindings = generateLayerBindings({name, system, graph});
  // this is a layer
  return {name, graph, system, atoms, bindings, composer, services}
};

export const generateLayerBindings = ({name, system, graph, bindings}) => {
  // construct bindings from the atom specs
  const generated = Binder.constructBindings(system);
  copyCrossLayerInputs(name, bindings, generated)
  // add graph.connections to inputBindings
  Binder.addConnections(name, graph.connections, generated);
  return generated;
};

// TODO(maria): cross-layer bindings (used for `selected` node), are not expressed in the graph atm,
// and need to be carried over, when layerBindings are regenerated.
const copyCrossLayerInputs = (layerName, currentBindings, newBindings) => {
  entries(currentBindings?.input).forEach(([key, bound]) => {
    if (!Id.matchesIdPrefix(key, layerName)) {
      newBindings.input[key] = [...bound];
    }
  });
};

// TODO(maria): this is a workaround:
// cross-layer bindings (used for `selected` node), are not expressed in the graph atm,
// and need to be carried over, when layerBindings are regenerated.
const copyCrossLayerInputs = (layerName, {input}, currentBindings) => {
  entries(currentBindings?.input).forEach(([key, bound]) => {
    if (!Id.matchesIdPrefix(key, layerName)) {
      input[key] = [...bound];
    }
  });
}

export const obliterateGraphLayer = async layer => {
  await Promise.all(map(layer.atoms, (name, atom) => atom.dispose()));
};

// make a map of Atoms from a map of AtomSpecs 
export const reifyAtoms = async (atoms, emit) => {
  //log('reifyAtoms: spec=', atoms);
  const system = {};
  const reifyAtom = async (name, spec) => system[name] = await emit(name, spec);
  await Promise.all(map(atoms, reifyAtom));
  //log('reifyAtoms: system = ', system);
  return system;
};

export const invalidate = async layer => Promise.all(values(layer.atoms).map(atom => atom.invalidate?.()));
// outside of a request, validation may be stalled, this will unstall it
export const revalidate = async layer => Promise.all(values(layer.atoms).map(atom => atom.validate?.()));

export const rerender = async layer => {
  const atoms = values(layer.atoms);
  atoms.forEach(atom => atom.render({$clear: true}));
  atoms.forEach(atom => atom.invalidate());
};

export const initializeData = async (layer) => {
  log.groupCollapsed('initializeData');
  // turn all the Atoms "on"
  log('strobing atoms');
  await invalidate(layer);
  // merge all the NodeStates
  const state = await Graphs.getNodeState(/*layer.name,*/layer.graph);
  // ... with the graph's own state
  assign(state, Graphs.getGraphState(/*layer.name, */layer.graph));
  // this is the LIVE DESIGN STATE (which does not include all of LIVE APP STATE)
  // if we don't capture it, Node defaults are overwritten by inspector
  layer.graph.state = state;
  // qualify local state
  const qualifiedState = Graphs.qualifyState(layer.name, state);
  // we must capture the LIVE APP STATE also, if it exists
  assign(qualifiedState, layer.flan.state)
  // create mutable copy of initial state
  const mutableState = deepCopy(qualifiedState);
  log('computed state', mutableState);
  log.groupEnd();
  return mutableState;
};

export const renameObject = async (layer, objectId, newId) => {
  // ensure unique id
  newId = Graphs.uniqueGraphId(layer.graph, newId);
  // replace all objectId references with newId in the durable graph
  layer.graph = Graphs.changeObjectId(layer.graph, objectId, newId);
  // fixup references in the live graph
  layer.flan.state = Graphs.changeStateId(layer.flan.state, objectId, newId);
  // fixup container references in the system 
  recontainSystemObjects(layer.system, objectId, newId);
};

export const recontainSystemObjects = (system, fromObjectId, toContainer) => {
  values(system).forEach(spec => {
    const from = `$${fromObjectId}\$`;
    if (spec.container?.includes(from)) {
      spec.container = spec.container.replace(from, `$${toContainer}$`);
    }
  });
};

export const atomIdsForObjectId = (layer, objectId) => {
  const atomPrefix = Id.qualifyId(layer.name, objectId);
  return keys(layer.atoms).filter(atomId => Id.matchesIdPrefix(atomId, atomPrefix));
};

export const obliterateObject = async (layer, objectId) => {
  const atomIds = atomIdsForObjectId(layer, objectId);
  atomIds.forEach(atomId => {
    layer.atoms[atomId].dispose();
    delete layer.atoms[atomId];
    delete layer.system[atomId];
  });
  // clean layer state
  const qualifiedPredix = `${Id.qualifyId(layer.name, objectId)}$`;
  keys(layer.flan.state).forEach(key => {
    if (key.startsWith(qualifiedPredix)) {
      delete layer.flan.state[key];
    }
  });
  // clean bindings
  Binder.removeBindings(layer.bindings, Id.qualifyId(layer.name, objectId));
  nullifyConnectedValues(layer, objectId);
};

export const nullifyConnectedValues = (layer, objectId) => {
  const nullify = (key, bound) => {
    if (Id.matchesIdPrefix(bound, objectId)) {
      const qualifiedAtomId = Id.qualifyId(layer.name, Id.sliceId(key, 0, -1));
      const prop = Id.sliceId(key, -1);
      layer.atoms[qualifiedAtomId].inputs = {[prop]: undefined};
    }
  };
  entries(layer.graph.connections).forEach(([key, bound]) => {
    if (Array.isArray(bound)) {
      bound.forEach(b => nullify(key, b));
    } else {
      nullify(key, bound);
    }
  });
};