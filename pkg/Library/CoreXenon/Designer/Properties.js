/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {nob} from '../Reactor/safe-object.js';
import * as Id from '../Framework/Id.js';
import * as Layers from '../Framework/Layers.js';
import * as Flan from '../Framework/Flan.js';
import * as Design from './DesignService.js';

// rolls down stairs, alone or in pairs! it's log!
const log = logf('Properties', 'darkorange', 'black');

export const updateProp = async (design, {propId, store, value}, objectId) => {
  if (propId) {
    if (store?.store?.type === 'Nonce') {
      Flan.set(design, Id.qualifyId(design.name, propId), value.property);
    } else if (propId === 'OpenStyle') {
      Design.applyStyleToObject(design, value, objectId)
    } else if (propId.endsWith('$Container')) {
      setObjectContainer(design, objectId, value);
    } else if (store.type === 'TypeWithConnection') {
      await updatePropWithConnection(design, objectId, propId, value);
    } else {
      updateDataProp(design, propId, value);
    }
    return true;
  }
};

const setObjectContainer = async (design, objectId, container) => {
  const isValidContainer = await validateContainer(design, container);
  if (isValidContainer) {
    design.graph.nodes[objectId].container = container;
    await Design.rebuildObject(design, objectId);
  }
};

const validateContainer = async (design, container) => {
  const atomId = Id.qualifyId(design.name, container.split('#')?.[0]);
  // TODO: validate the template also has the appropriate slot in it.
  return design.atoms[atomId]?.hasTemplate();
};

const updateDataProp = (design, propId, value) => {
  log('updateDataProp', propId, value);
  // this prop is changed in the durable graph state
  (design.graph.state ??= {})[propId] = value;
  // this prop is changed in the live application state
  Flan.set(design, Id.qualifyId(design.name, propId), value);
};

const updatePropWithConnection = async (design, objectId, propId, value) => {
  const connections = design.graph.connections ??= nob();
  const connValue = value.connection?.value;
  if (connValue?.length > 0) {
    if (!connectionsEqual(connections[propId], connValue)) {
      log(`connecting '${propId}' to '${connValue?.join?.(',') ?? connValue}'`);
      // change the connection in the graph
      connections[propId] = connValue;
      // rebuild bindings
      design.bindings = Layers.generateLayerBindings(design);
      // push the newly connected value to object(id)
      const liveValue = design.flan.state[Id.qualifyId(design.name, connValue)];
      const justTheseNodes = [Id.qualifyId(design.name, objectId)];
      Flan.forwardStateChanges(design.flan, {[Id.qualifyId(design.name, propId)]: liveValue}, justTheseNodes);
    }
  } else {
    updateDataProp(design, propId, value.property);
    if (connections?.[propId]) {
      delete connections[propId];
      // rebuild bindings
      design.bindings = Layers.generateLayerBindings(design);
    }
  }
};

const connectionsEqual = (conns1, conns2) => {
  // note: connections can be a string or an array of strings
  const dedupe = conns => [... new Set(Array.isArray(conns) ? conns : [conns])];
  return deepEqual(dedupe(conns1), dedupe(conns2));
};



