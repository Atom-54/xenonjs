/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {SafeObject} from '../../Library/CoreReactor/safe-object.js';
import * as Id from './Id.js';

// be abrubt
const {entries, create, keys, map} = SafeObject;
const {qualifyId: quid} = Id;

// logging
const log = logf('Binder', 'blueviolet', 'white');

/*
inputBindings :: {<graphScopeKey>: [{id: <layerScopeAtomKey>, prop: <propertyName>}]}

If `<graphState>.<graphScopeKey>` changes, we
use `inputBindings` to find the Atom properties to update.
*/
const addInputBinding = (b$, key, id, prop) => (b$.inputBindings[key] ??= []).push({id, prop});

/*
outputBindings :: <layerScopeAtomKey>: {<prop>: <graphScopeKey>}

If Atom `<layerScopeAtomKey>` produces output, the output fields 
are matched against `prop`s in `outputBindings` to find the
`<graphScopeKey>`s to update.
*/
const addOutputBinding = (b$, key, prop, binding) => (b$.outputBindings[key] ??= create(null))[prop] = binding;

export const constructBindings = system => {
  const bindings = {
    // mapping data keys from App-scope to Atom-scope
    inputBindings: create(null),
    // mapping data keys from Atom-scope to App-scope
    outputBindings: create(null)
  };
  // system is a map of AtomSpecs, usually prepared from one or more Nodes, that
  // have been disambiguated to fit in one scope
  map(system, (atomId, atomSpec) => addAtomSpecBindings(bindings, atomId, atomSpec));
  // log
  log.groupCollapsed('bindings:');
  log(bindings);
  log.groupEnd();
  // result
  return bindings;
};

const addAtomSpecBindings = (bindings, atomId, atomSpec) => {
  // unpack the objectId
  const objectId = Id.sliceId(atomId, 0, -1);
  // add bindings from the atom spec
  map(atomSpec.bindings, (prop, bound) => addBoundProperty(bindings, objectId, atomId, prop, bound));  
  // inputs
  atomSpec.inputs?.forEach(prop => addInputBinding(bindings, quid(atomId, prop), atomId, prop));
  // outputs
  atomSpec.outputs?.forEach(prop => addOutputBinding(bindings, atomId, prop, quid(atomId, prop)));
};

const addBoundProperty = (bindings, objectId, atomId, inProp, bound) => {
  // Array-ify simple-string 'bound' values
  bound = typeof bound === 'string' ? [bound] : bound;
  // for each value bound on this atom spec
  bound?.forEach(binding => {
    // create mapping from qualified state prop to input prop
    addInputBinding(bindings, quid(objectId, binding), atomId, inProp);
    // create mapping from output prop to qualified state prop
    const [outId, outProp] = Id.splitId(binding);
    addOutputBinding(bindings, quid(objectId, outId), outProp, quid(objectId, binding));
  });
};

export const addConnections = (layerId, connections, inputBindings) => {
  // update input/outputBindings with cross-node connections
  entries(connections).forEach(([propId, bound]) => {
    const {id, prop} = Id.parsePropId(propId);
    if (typeof bound === 'string') {
      bound = [bound];
    }
    // for each output target
    bound?.forEach(bound => {
      addInputBinding({inputBindings}, quid(layerId, bound), quid(layerId, id), prop);
    });
  });
}

export const processOutput = (name, output, outputBindings) => {
  // output object contains App-scoped key-value pairs.
  // `outputBindings` shows how to remap property names 
  // from Atom-scope to App-scope.
  const map = outputBindings[name];
  if (map) {
    const scoped = scopeOutput(output, map);
    if (keys(scoped).length) {
      log('output', keys(output), 'bound to', keys(scoped), 'for', name);
    }
    return scoped;
  }
};

const scopeOutput = (output, map) => {
  // convert keys in `output` as specified in `map`
  // {foo: 3} * {foo: bar} => {bar: 3}
  return entries(output??0).reduce(
    (scoped, [key, value]) => {
      // if key is not in map, it's probably a mistake in the Node
      if (value !== undefined && map[key]) {
        scoped[map[key]] = value;
      }
      return scoped;
    }, 
    create(null)
  );
};

export const processInput = (state, inputBindings/*, persistor*/) => {
  return entries(state)
    .flatMap(([key, value]) => processKeyValue(key, value, inputBindings/*, persistor*/))
    .filter(i=>i)
    ;
};

const processKeyValue = (key, value, inputBindings/*, persistor*/) => {
  // inputBindings map keys from App-scope to Atom-scope
  // if there are bindings for this data, map the keys
  // + and persist the data if flagged 
  const bindings = inputBindings[key];
  if (bindings) {
    // TODO(sjmiles): feels out of place
    // if (value !== undefined) {
    //   bindings.map(({persist}) => persist && persistor?.(key, value));
    // }
    // restructure binding data
    const bound = bindings.map(({id, prop}) => ({id, inputs: {[prop]: value}}));
    if (bound?.length) {
      log('input', [key], 'bound to', bindings.map(({id, prop})=> `${id}.${prop}`));
    }
    // provide binding data
    return bound;
  }
};

export const removeBindings = ({inputBindings, outputBindings}, objectId) => {
  const prefix = Id.qualifyId(objectId, '');
  const matches = id => id.startsWith(prefix);
  entries(inputBindings).forEach(([key, bound]) => {
    if (matches(key)) {
      delete inputBindings[key];
    } else {
      inputBindings[key] = bound.filter(({id}) => !matches(id));
    }
  });
  keys(outputBindings).forEach(key => {
    if (matches(key)) {
      delete outputBindings[key];
    }
  });
};
