persistations.$GraphList$graphAgent$publishedGraphsUrl = `${globalThis.config.firebaseConfig.databaseURL}/${globalThis.config.publicGraphsPath}`;
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {assign, keys, nob} from '..//Reactor/safe-object.js';
import * as Id from '..//Framework/Id.js';
import * as Binder from '..//Framework/Binder.js';
import * as Graphs from '..//Framework/Graphs.js';
import * as Layers from '..//Framework/Layers.js';
import * as App from '..//Framework/App.js';
import * as Design from './DesignService.js';

const defaultLayout = {l: 32, t: 32, w: 132, h: 132};
const designerId = 'Main';
const rootContainer = `${designerId}$panel#Container`;

// TODO: make a clearer API (it's now Add w/optional Delete).
export const morphObject = async (layer, objectId, meta) => {
  const type = meta?.type?.type;
  const {state, layout} = (meta ?? 0);
  const node = layer.graph.nodes[objectId];
  // if there is a node, is it really morphing?
  if (!node || (type !== node.type)) {
    return createOrReplaceObject(layer, objectId, node, type, state, layout);
  }
};

const createOrReplaceObject = async (layer, objectId, node, type, state, layout) => {
  // ensure unique id
  const id = createUniqueId(layer.graph, type);
  // here is the new shape
  const object = createObjectSpec(node, type);
  if (objectId) {
    await replaceObject(layer, objectId, newId, object);
  } else {
    addObject(layer, id, object, state, layout);
  }
  // update graph
  return objectChanged(layer, id);
};

const createUniqueId = (graph, type) => {
  const name = nameFromType(type);
  return Graphs.uniqueGraphId(graph, name);
};

const nameFromType = type => {
  let name = type.split('/').pop() ?? 'Object';
  if (name.endsWith('Node')) {
    name = name.slice(0, -4);
  }
  return name;
};

const createObjectSpec = (node, type) => {
  return {      
    type,
    container: node?.container ?? rootContainer
  };
};

const addObject = async (layer, newId, object, state, layout) => {
  layer.graph.nodes[newId] = object;
  keys(state).forEach(key => {
    layer.graph.state[Id.qualifyId(newId, key)] = state[key];
  });
  Design.applyStyleToObject(layer, {...defaultLayout, ...layout??{}}, newId);
};

const replaceObject = async (layer, objectId, newId, object) => {
  // remove objectId from layer
  await Layers.obliterateObject(layer, objectId);
  // any object formerly contained by objectId are now part of node.container
  recontainChildren(layer, objectId);
  // TODO: keep the `state` and `connections` that are still relevant for the new object's type.
  deleteObjectState(layer.graph, objectId);
  deleteObjectConnections(layer.graph, objectId);    
  // replace all objectId references with newId
  const mod = Graphs.changeObjectId(layer.graph, objectId, newId);
  // install object
  mod.nodes[newId] = object;
  // install graph
  layer.graph = mod;
  layer.flan.state = Graphs.changeStateId(layer.flan.state, objectId, newId);
};

const objectChanged = async (layer, id) => {
  // update layout
  reifyGraphLayout(layer);
  // construct new atoms
  await reifyObject(layer, id);
  // save the graph with the new object in it
  Design.save(layer);
};

export const reifyObject = async (layer, id) => {
  // this graph
  const graph = layer.graph;
  // this nodes
  const node = graph.nodes[id];
  // create atom specs from node type
  const system = nob();
  await Graphs.nodeTypeToAtomSpecs(layer.name, system, id, node);
  assign(layer.system, system);
  // create atoms from layer objects
  const atoms = await layer.flan.atomsFactory(system);
  // memoize
  assign(layer.atoms, atoms);
  // connect to listeners
  App.connectAtoms(layer, atoms);
  // is live
  log('reify made:', node, system, atoms);
  // add object's bindings
  const {inputBindings, outputBindings} = Binder.constructBindings(system);
  assign(layer.bindings.inputBindings, inputBindings);
  assign(layer.bindings.outputBindings, outputBindings);
  // add object's connections
  Binder.addConnections(layer.name, connectionsByObjectId(graph, id), layer.bindings.inputBindings);
  // apply virtualized state to the reified object and the designer object.
  await App.setAtomsData(layer, [
    ...atomIdsForObjectId(layer, id),
    ...atomIdsForObjectId(layer, designerId)
  ]);
  // select this object
  App.set(layer, Design.getDesignSelectedKey(layer), id);
};

export const deleteObject = (layer, objectId) => {
  removeObject(layer, objectId);
  App.set(layer, Design.getDesignSelectedKey(layer), null);
  Design.save(layer);
};

const removeObject = (layer, objectId) => {
  if (objectId && objectId !== 'Main') {
    Layers.obliterateObject(layer, objectId);
    // any object formerly contained by objectId are now part of node.container
    recontainChildren(layer, objectId);
    layer.graph = deleteObjectFromGraph(layer, objectId);
  }
};

const recontainChildren = (layer, objectId) => {
  const node = layer.graph.nodes[objectId];
  const recontainedObjectIds = Graphs.recontainObjects(layer.graph, objectId, node.container);
  recontainedObjectIds.forEach(objectId => rebuildObject(layer, objectId));
};

export const rebuildObject = async (layer, id) => {
  await Layers.obliterateObject(layer, id);
  return reifyObject(layer, id);
};

const atomIdsForObjectId = ({name, atoms}, objectId) => {
  const atomPrefix = Id.qualifyId(name, objectId, '');
  return keys(atoms).filter(atomId => atomId.startsWith(atomPrefix));
};

const connectionsByObjectId = (graph, id) => {
  const prefix = `${id}\$`;
  const addConn = (connections, key, conn) => {
    if (key.startsWith(prefix) || conn.startsWith(prefix)) {
      connections[key] = conn;
    }
  }
  return entries(graph.connections).reduce((connections, [key, conn]) => {
    if (Array.isArray(conn)) {
      conn.forEach(c => addConn(connections, key, c));
    } else {
      addConn(connections, key, conn);
    }
    return connections;
  }, nob());
};

const reifyGraphLayout = layer => {
  // this is the layer metadata
  const layout = layer.graph.state[Design.simpleLayoutKey];
  // assign mutable copy of the data to the system key
  App.set(layer, Design.getDesignLayoutKey(layer), deepCopy(layout));  
};

const deleteObjectFromGraph = (layer, objectId) => {
  const graph = layer.graph;
  delete graph.nodes[objectId];
  delete graph.meta.graphRects?.[objectId];
  if (graph.state[Design.simpleLayoutKey]) {
    delete graph.state[Design.simpleLayoutKey][objectId];
  }
  deleteObjectState(graph, objectId);
  deleteObjectConnections(graph, objectId);
  return graph;
};

const deleteObjectState = (graph, objectId) => {
  keys(graph.state).forEach(key => {
    if (key.startsWith(`${objectId}\$`)) {
      delete graph.state[key];
    }
  });
};

const deleteObjectConnections = (graph, objectId) => {
  const propPrefix = Id.qualifyId(objectId, '');
  const deleteConn = (key, bound) => {
    if (key.startsWith(propPrefix) || bound.startsWith(propPrefix)) {
      delete graph.connections[key];
    }
  }
  entries(graph.connections).forEach(([key, bound]) => {
    if (Array.isArray(bound)) {
      bound.forEach(b => deleteConn(key, b));
    } else {
      deleteConn(key, bound);
    }
  });
};

export const cloneObject = async (layer, objectId) => {
  const graph = layer.graph;
  // clone the node
  const newId =  Graphs.uniqueGraphId(graph, objectId);
  const objectGraphRect = graph.meta.graphRects?.[objectId];
  if (objectGraphRect) {
    graph.meta.graphRects[newId] = {...objectGraphRect, t: objectGraphRect.t + 90};
  }
  graph.nodes[newId] = {...graph.nodes[objectId]};
  // copy state
  entries(graph.state).forEach(([prop, value]) => {
    if (Id.sliceId(prop, 0, 1) === objectId) {
      graph.state[Id.qualifyId(newId, Id.sliceId(prop, 1))] = deepCopy(value);
    }
  });
  // copy layout
  const layout = graph.state[Design.simpleLayoutKey];
  const objectLayout = deepCopy(layout[objectId]);
  layout[newId] = assign(objectLayout, {l: objectLayout?.l + 50, t: objectLayout?.t + 50});
  // copy connections
  entries(graph.connections).forEach(([prop, conn]) => {
    if (Id.sliceId(prop, 0, 1) === objectId) {
      graph.connections[Id.qualifyId(newId, Id.sliceId(prop, 1))] = conn;
    }
  });
  // set graph
  layer.graph = {...graph, nodes: {...graph.nodes}};
  // update graph
  return objectChanged(layer, newId);
};

export const renameObject = async (layer, objectId, {name: newId}) => {
  if (layer.graph.nodes[objectId]) {
    // remove object
    await Layers.obliterateObject(layer, objectId);  
    // rename object
    Layers.renameObject(layer, objectId, newId);
    // reanimate object
    return objectChanged(layer, newId);
  }
};

export const recontain = async (layer, {key: objectId, value}) => {
  const key = value.replace(/_/g, '$');
  const container = Id.sliceId(key, 1);
  if (layer.graph.nodes[objectId] && container) {
    return setObjectContainer(layer, objectId, container);
  }
};

const setObjectContainer = async (layer, objectId, container) => {
  const isValidContainer = await validateContainer(layer, container);
  if (isValidContainer) {
    layer.graph.nodes[objectId].container = container;
    await rebuildObject(layer, objectId);
    Design.save(layer);
  }
};

const validateContainer = async (layer, container) => {
  const atomId = Id.qualifyId(layer.name, container.split('#')?.[0]);
  // TODO: validate the template also has the appropriate slot in it.
  return layer.atoms[atomId]?.hasTemplate();
};
