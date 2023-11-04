/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {nob} from '../Reactor/safe-object.js';
import * as Id from '../Framework/Id.js';
import * as Layers from '../Framework/Layers.js';
import * as Flan from '../Framework/Flan.js';
import * as Design from './DesignService.js';
import * as Structure from './Structure.js';

// rolls down stairs, alone or in pairs! it's log!
const log = logf('Properties', 'darkorange', 'black');

export const updateProp = async (design, {propId, store, value}, objectId) => {
  if (propId) {
    if (propId === 'OpenStyle') {
      Design.applyStyleToObject(design, value, objectId)
    } else if (propId.endsWith('$Container')) {
      Structure.setObjectContainer(design, objectId, value);
    } else if (store.type === 'TypeWithConnection') {
      await updatePropWithConnection(design, objectId, propId, value);
    } else {
      updateDataProp(design, propId, value);
    }
    return true;
  }
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
      // push the newly connected value to the target
      const liveValue = design.flan.state[Id.qualifyId(design.name, connValue)];
      const connectTarget = Id.sliceId(propId, 0, -2);
      const justTheseNodes = [Id.qualifyId(design.name, connectTarget)];
      // Just curious, why did you comment this out? the old property value is maintained...
      //updateDataProp(design, propId, undefined);
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

export const orderBefore = (layer, objectId, beforeId) => {
  const {nodes} = layer.graph;
  const [src, target] = [nodes[objectId], nodes[beforeId]];
  if (src && target) {
    const {container} = target;
    const refLayout = Design.DesignService.GetLayoutObject(layer, null, {objectId: beforeId});
    const beforeOrder = (refLayout.order - 1) || 0;
    log.debug('request to move', src, 'to before', target, 'in container', [container], 'to position', beforeOrder);
  }
};

