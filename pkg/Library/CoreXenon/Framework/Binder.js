/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {entries, create, keys, map} from '../Reactor/safe-object.js';
import * as Id from './Id.js';

// logging
const log = logf('Binder', 'blueviolet', 'white');

export const constructBindings = system => {
  const bindings = {
    // maps state to atom inputs
    input: create(null),
    // maps atom outputs to state
    output: create(null)
  };
  // system is a map of AtomSpecs, usually prepared from one or more Nodes, that
  // have been disambiguated to fit in one scope
  map(system, (atomId, atomSpec) => addAtomSpecBindings(bindings, atomId, atomSpec));
  // log
  // log.groupCollapsed('bindings:');
  log(bindings);
  // log.groupEnd();
  // result
  return bindings;
};

const addAtomSpecBindings = (bindings, atomId, atomSpec) => {
  // each atom input receives from a state key
  atomSpec.inputs?.forEach(prop => {
    const key = Id.qualifyId(atomId, prop);
    addBinding(bindings.input, key, key);
  });
  // unpack the node id
  const nodeId = Id.sliceId(atomId, 0, -1);
  // add input bindings from the atom spec
  map(atomSpec.bindings, (prop, bounded) => {
    if (!Array.isArray(bounded)) {
      bounded = [bounded];
    }
    const value = Id.qualifyId(atomId, prop);
    //addBinding(bindings.output, value, value);
    bounded.forEach(bound => {
      const key = Id.qualifyId(nodeId, bound);
      addBinding(bindings.output, key, key);
      addBinding(bindings.input, key, value);
      //addBinding(bindings.input, key, key);
    });
  });
  // each atom output sends to a state key
  atomSpec.outputs?.forEach(prop => {
    const key = Id.qualifyId(atomId, prop);
    addBinding(bindings.output, key, key);
  });
};

const addBinding = (bindings, key, value) => {
  const bound = bindings[key] ??= [];
  if (!bound.includes(value)) {
    bound.push(value);
  }
};

export const addConnections = (layerId, connections, bindings) => {
  // update input/outputBindings with cross-node connections
  entries(connections).forEach(([propId, bound]) => {
    //const {id, prop} = Id.parsePropId(propId);
    if (typeof bound === 'string') {
      bound = [bound];
    }
    // for each output target
    bound?.forEach(bound => {
      let effectiveBound = bound;
      let effectiveLayerId = layerId;
      addBinding(bindings.input, 
        Id.qualifyId(effectiveLayerId, effectiveBound), 
        Id.qualifyId(effectiveLayerId, propId)
      );
    });
  });
};

export const removeBindings = (bindings, objectId) => {
  const remove = bindings => entries(bindings).forEach(([key, bound]) => {
    if (Id.matchesIdPrefix(key, objectId)) {
      delete bindings[key];
    } else {
      bindings[key] = bound.filter(id => !Id.matchesIdPrefix(id, objectId));
    }
  });
  remove(bindings.input);
  remove(bindings.output);
};

export const mapOutputToBindings = (atomId, output, bindings) => {
  const scoped = {};
  map(output, (key, value) => {
    if (value !== undefined) {
      const propKey = Id.qualifyId(atomId, key);
      bindings.output[propKey]
        ?.map(key => expandSublayerBinding(key))
        .forEach(key => scoped[key] = value)
        ;
    }      
  });
  log('boundOutput:', scoped, output);
  return scoped;
};

const expandSublayerBinding = (key) => {
  if (!key.includes('_')) {
    return key;
  }
  const [layerName, layerObjectKey, ...etc] = Id.splitId(key);
  const [layerKey, objectKey] = layerObjectKey.split('_');
  const sublayerId = `${layerName}${layerKey}`;
  const expandedKey = Id.joinId(sublayerId, objectKey, ...etc);
  //log.debug('Expanded key', key, 'to', expandedKey);
  return expandedKey;
};

export const mapInputToBindings = (input, bindings) => {
  const scoped = {};
  map(input, (key, value) => {
    // expand sublayer references keys into full keys
    const expandedInputs = expandIo(bindings.input);
    // now lookup bindings
    const bound = expandedInputs[key];
    if (bound) {
      bound.forEach(key => scoped[key] = value);
    }
  });
  log('boundInput:', scoped, input);
  return scoped;
};

const expandIo = io => entries(io).reduce((expanded, [key, binding]) => {
  expanded[expandSublayerBinding(key)] = binding;
  return expanded;
}, {});
