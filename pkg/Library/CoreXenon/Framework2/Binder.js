/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {entries, create, keys, map} from '../Reactor/safe-object.js';
import * as Id from './Id.js';

// logging
const log = logf('Binder2', 'blueviolet', 'white');
logf.flags.Binder2 = true;

let allBindings;

export const constructBindings = system => {
  const bindings = allBindings ??= {
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
  map(atomSpec.bindings, (prop, bound) => {
    const key = Id.qualifyId(atomId, prop);
    const value = Id.qualifyId(nodeId, bound);
    addBinding(bindings.input, key, value);
  });
  // each atom output sends to a state key
  atomSpec.outputs?.forEach(prop => {
    const key = Id.qualifyId(atomId, prop);
    addBinding(bindings.output, key, key);
  });
};

const addBinding = (bindings, key, value) => (bindings[key] ??= []).push(value);

export const mapOutputToBindings = (atomId, output, bindings) => {
  const scoped = {};
  map(output, (key, value) => {
    if (value !== undefined) {
      const propKey = Id.qualifyId(atomId, key);
      const bound = bindings[propKey];
      if (bound) {
        bound.forEach(key => scoped[key] = value);
      }
    }
  });
  //log.group('processOutput:');
  //log(output);
  //log('boundOutput:', scoped);
  //log.groupEnd();
  return scoped;
};

export const processOutput = (atomId, output, bindings) => mapOutputToBindings(atomId, output, allBindings.output);

export const mapInputToBindings = (input, bindings) => {
  const scoped = {};
  map(input, (key, value) => {
    const bound = bindings[key];
    if (bound) {
      bound.forEach(key => scoped[key] = value);
    }
  });
  log('boundInput:', scoped, input);
  return scoped;
};

export const processInput = (input, bindings) => mapInputToBindings(input, allBindings.input);

