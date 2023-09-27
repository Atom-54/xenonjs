/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {create, values, map} from '../Reactor/safe-object.js';
import {dirtyCheck} from '../Reactor/Atomic/js/utils/object.js';
import * as Binder from './Binder.js';
import * as Layers from './Layers.js';
import * as App from './App.js';
import * as Id from './Id.js';

const log = logf('Flan', 'purple', '#eeeeee');

export const createFlan = (emitter, Composer, library, persistations) => ({
  layers: create(null),
  state: create(null),
  emitter,
  Composer,
  library,
  persistations
});

export const createLayer = async (flan, graphOrGraphs, name) => {
  // TODO(sjmiles): explain order-of-operations here
  const layer = await App.createLayer(graphOrGraphs, flan.emitter, flan.Composer, flan.library.services, name);
  await addLayer(flan, layer);  
  return layer;
};

export const destroyLayer = async (layer) => {
  // TODO(sjmiles): explain which comes first and why
  App.obliterateLayer(layer);
  removeLayer(layer.flan, layer);
};

const addLayer = async (flan, layer) => {
  // bookkeep
  layer.flan = flan;
  flan.layers[layer.name] = layer;
  // initialize data
  initializeData(flan, layer);
};

const removeLayer = (flan, layer) => {
  delete flan.layers[layer.name];
};

const initializeData = async (flan, layer) => {
  // get hard-coded graph data
  const data = await Layers.initializeData(layer);
  // get persisted data
  map(flan.persistations, (name, value) => {
    if (Id.matchesIdPrefix(name, layer.name)) {
      data[name] = value;
    }
  });
  // apply it to Atoms
  return setData(layer, data);
};

export const setData = async (layer, data) => {
  forwardBoundInput(layer, data);
};

export const forwardBoundInput = ({flan, onvalue}, scopedInput) => {
  // remove output that is unchanged from state
  const dirtyInput = dirtyCheck(flan.state, scopedInput);
  // if there is any...
  if (keys(dirtyInput).length) {
    // drop input into state
    assign(flan.state, dirtyInput);
    // allow layer to intervene
    onvalue?.(dirtyInput);
    // send bound inputs to Atoms
    forwardStateChanges(flan, dirtyInput);
  }
};

export const forwardStateChanges = (flan, inputs, justTheseNodes) => {
  values(flan.layers).forEach(layer => {
    const boundInput = Binder.mapInputToBindings(inputs, layer.bindings);
    let inputsByAtom = create(null);
    map(boundInput, (id, value) => {
      const atomId = Id.sliceId(id, 0, -1);
      const propId = Id.sliceId(id, -1);
      const inputs = (inputsByAtom[atomId] ??= create(null));
      inputs[propId] = value;
    });
    if (justTheseNodes) {
      inputsByAtom = filterAtomMapByNodeIds(inputsByAtom, justTheseNodes);
    }
    const {atoms} = layer;
    map(inputsByAtom, (id, inputs) => atoms[id] && (atoms[id].inputs = inputs));
  }); 
};

const filterAtomMapByNodeIds = (byAtom, justTheseNodes) => {
  const filtered = create(null);
  justTheseNodes.forEach(nodeId => map(byAtom, (id, inputs) => {
    if (Id.matchesIdPrefix(id, nodeId)) {
      filtered[id] = inputs;
    }
  }));
  return filtered;
};

export const forwardBoundOutput = (layer, atomName, output) => {
  // translate atom output through outputBindings to create boundInput
  const boundInput = Binder.mapOutputToBindings(atomName, output, layer.bindings);
  // feed bindings back as boundInput
  forwardBoundInput(layer, boundInput);
};

export const clearData = (layer, atomIds) => {
  const ob = layer.bindings.output;
  const getAtomPropKeys = atomId => keys(ob[atomId]).map(key => Id.qualifyId(atomId, key));
  const ids = atomIds ?? keys(layer.atoms);
  const props = ids.flatMap(atomId => getAtomPropKeys(atomId));
  const nullify = create(null);
  props.forEach(key => nullify[key] = undefined);
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
