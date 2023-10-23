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

export const addConnections = (layerId, connections, bindings/*, sublayers*/) => {
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
      // if (bound.includes('_')) {
      //   const [layerKey, _effectiveBound] = bound.split('_');
      //   effectiveBound = _effectiveBound;
      //   effectiveLayerId = sublayers[layerKey];
      // }
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

export const mapOutputToBindings = (atomId, output, bindings, sublayers) => {
  const scoped = {};
  map(output, (key, value) => {
    if (value !== undefined) {
      const propKey = Id.qualifyId(atomId, key);
      const bound = bindings.output[propKey];
      if (bound) {
        bound.forEach(key => scoped[expandSublayerBinding(key, sublayers)] = value);
      }
    }
  });
  log('boundOutput:', scoped, output);
  return scoped;
};

const expandSublayerBinding = (key, sublayers) => {
  if (!key.includes('_')) {
    return key;
  }
  const [layerKey, effectiveKey] = key.split('_');
  const expandedKey = Id.joinId(sublayers?.[layerKey], effectiveKey);
  log.debug('Expanded key', key, 'to', expandedKey);
  return expandedKey;
};

// if (bound.includes('_')) {
//   const [layerKey, _effectiveBound] = bound.split('_');
//   effectiveBound = _effectiveBound;
//   effectiveLayerId = sublayers[layerKey];
// }

export const mapInputToBindings = (input, bindings, sublayers) => {
  const scoped = {};
  map(input, (key, value) => {
    const expandedInputs = entries(bindings.input).reduce((expanded, [key, binding]) => {
      expanded[expandSublayerBinding(key, sublayers)] = binding;
      return expanded;
    }, {});
    //const expandedInputs = bindings.input.map(key => expandSublayerBinding(key, sublayers));
    // if (key.includes('_')) {
    //   log.debug('layer bound key:', key);
    // }
    //const bound = bindings.input[key];
    const bound = expandedInputs[key];
    if (bound) {
      bound.forEach(key => {
        // if (key.includes('_')) {
        //   log.debug('layer bound key:', key);
        // }
        scoped[key] = value
      });
    }
  });
  log('boundInput:', scoped, input);
  return scoped;
};
