/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {SafeObject} from 'xenonjs/Library/CoreReactor/safe-object.js';
import {deepCopy, deepEqual} from 'xenonjs/Library/CoreReactor/Atomic/js/utils/object.js';
import * as App from 'xenonjs/Library/CoreFramework/App.js';
import * as Binder from 'xenonjs/Library/CoreFramework/Binder.js';
import * as Graphs from 'xenonjs/Library/CoreFramework/Graphs.js';
import * as Layers from 'xenonjs/Library/CoreFramework/Layers.js';
import * as Id from 'xenonjs/Library/CoreFramework/Id.js';

// rolls over the neighbor's dog! it's log!
const log = logf('DesignApp', 'orange', 'black');
//log.flags.DesignApp = true;

// be pithy
const {assign, create, entries, keys, values, nob} = SafeObject;

export const designerId = 'Main';
export const designSelectedKey = 'design$Main$designer$selected';
export const baseSelectedKey = '$NodeGraph$Graph$selected';

const defaultDesignerContainer = 'Main$panel#Container';
const designerLayoutKey = 'Main$designer$layout';
const layerLayoutKey = 'design$Main$designer$layout';

let xenon, Composer;

export const configureDesignApp = options => {
  xenon = options?.xenon;
  Composer = options?.Composer;
};

export const getSelectedObjectId = layer => {
  return App.get(layer, designSelectedKey);
};

export const DesignApp = {
};

export const createDesignLayer = async graph => {
  // create design layer
  const design = await App.createLayer(graph, xenon.emitter, Composer, /* services= */ {}, 'design');
  values(design.system).forEach(meta => {
    // recontextualize root
    if (meta.container === Id.qualifyId(design.name, 'root$panel#Container')) {
      meta.container = '$WorkPanel$splitPanel#Container'
    }
  });
  await App.initializeData(design);
  design.onvalue = state => state && onValue(design, state);
  return design;
};

const onValue = (layer, state) => {
  if (layerLayoutKey in state) {
    log('onValue: persistable layout changed');
    layer.graph.state[designerLayoutKey] = state[layerLayoutKey];
    save(layer);
  }
  if (designSelectedKey in state) {
    // copy design.selected to app.selected
    App.set(app, baseSelectedKey, state[designSelectedKey]);
  }
};

export const obliterateGraph = async (owner, graph) => {
  // obliterate same
  globalThis.design && await App.obliterateLayer(globalThis.design);
  // layer is gone
  globalThis.design = null;
};

// load 'graph' into the design layer
export const designGraph = async (owner, graph) => {
  // all the ids about to be obliterated
  const disposedAtomIds = new Set(keys(globalThis.design?.system));
  // obliterate selected graph
  obliterateGraph(owner, graph);
  // allow customization
  const id = Graphs.getDesignerId(graph);
  // if you have no state, you get this state
  graph.state ??= {
    // [`${[id]}$panel$canvasLayout`]: 'absolute'
  };
  // this designer should be editable
  graph.state[`${id}$designer$disabled`] = false;
  // reify stuff
  const design = await createDesignLayer(graph, xenon, Composer);
  globalThis.design = design;
  // more clean up
  // for example, bob's AtomToolbar is contained by app.designed's DesignerPanel,
  // hence it needs to be rerendered, if app.designed was re-created.
  entries(globalThis.app.system).forEach(([id, spec]) => {
    if (disposedAtomIds.has(spec.container?.split('#').shift())) {
      globalThis.app.atoms[id].invalidate();
    }
  });
  // `createDesignLayer` may alter design.graph to collect
  // node state into graph state
  save(design);
  // we monkeyed with it, I guess, not sure why?
  return graph;
};

const updateLayout = layer  => {
  // this is the layer metadata
  const layout = layer.graph.state[designerLayoutKey];
  // assign mutable copy of the data to the system key
  App.set(layer, layerLayoutKey, deepCopy(layout));  
};

export const applyStyleToObject = (layer, style, objectId) => {
  // sanity check
  if (objectId) {
    // layout is here
    const layout = App.get(layer, layerLayoutKey) ?? nob();
    // mutatable
    const mod = deepCopy(layout);
    // create/modify entry in layout
    assign(mod[objectId] ??= nob(), style);
    // retain in designed state
    (layer.graph.state??={})[Id.sliceId(layerLayoutKey, 1)] = mod;
    // update live state
    App.set(layer, layerLayoutKey, mod);
  }
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
  const atoms = await Layers.reifyAtoms(system, xenon.emitter);
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
  App.set(layer, designSelectedKey, id);
};

export const rebuildObject = async (layer, id) => {
  await obliterateObject(layer, id);
  return reifyObject(layer, id);
};

const connectionsByObjectId = (graph, id) => {
  const prefix = `${id}$`;
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
  }, create(null));
};

export const removeObject = layer => {
  const objectId = getSelectedObjectId(layer);
  obliterateObject(layer, objectId);
  // any object formerly contained by objectId are now part of node.container
  recontainChildren(layer, objectId);
  layer.graph = deleteObjectFromGraph(layer, objectId);
  save(layer);
  App.set(layer, designSelectedKey, null);
};

const recontainChildren = (layer, objectId) => {
  const {graph} = layer;
  const node = graph.nodes[objectId];
  const recontainedObjectIds = Graphs.recontainObjects(graph, objectId, node.container);
  recontainedObjectIds.forEach(objectId => rebuildObject(layer, objectId));
};

export const obliterateObject = async (layer, objectId) => {
  Layers.obliterateObject(layer, objectId);
};

const deleteObjectFromGraph = (layer, objectId) => {
  const graph = layer.graph;
  delete graph.nodes[objectId];
  delete graph.meta.graphRects?.[objectId];
  deleteObjectState(graph, objectId);
  deleteObjectConnections(graph, objectId);
  delete graph.state[designerLayoutKey][objectId];
  return graph;
};

const deleteObjectState = (graph, objectId) => {
  keys(graph.state).forEach(key => {
    if (key.startsWith(`${objectId}$`)) {
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

const atomIdsForObjectId = ({name, atoms}, objectId) => {
  const atomPrefix = Id.qualifyId(name, objectId, '');
  return keys(atoms).filter(atomId => atomId.startsWith(atomPrefix));
};

export const save = layer => {
  const app = globalThis.app;
  if (layer && !layer.graph.meta.readonly) {
    log('save graph:', layer.graph.meta.id);
    const graphs = App.get(app, '$GraphList$graphAgent$graphs');
    const newGraph = deepCopy(layer.graph);
    const newGraphs = replaceGraph(graphs, newGraph);
    if (newGraphs) {
      App.set(app, '$GraphList$graphAgent$graphs', newGraphs);
      App.set(app, '$NodeTypeList$typeList$graphs', newGraphs);
      App.set(app, '$GraphList$graphAgent$graph', newGraph);
    }
  }
};

const replaceGraph = (graphs, graph) => {
  if (graphs && keys(graph).length) {
    const result = [...graphs];
    const index = result.findIndex(g => g?.meta?.id === graph.meta?.id);
    if (index >= 0) {
      result[index] = graph;
      return result;
    }
  }
  // return result;
};

export const getLayers = () => [
    globalThis.app,
    globalThis.design
  ].filter(i=>i)
  ;

// TODO: make a clearer API (it's now Add w/optional Delete).
export const morphObject = async (owner, layer, meta) => {
  const {graph} = layer;
  let objectId = getSelectedObjectId(layer);
  const node = graph.nodes[objectId];
  if (!node || (meta?.type?.type !== node.type)) {
    // here is the new shape
    const type = meta?.type?.type;
    const object = {      
      type: type,
      container: node?.container ?? defaultDesignerContainer
    };
    // get name from type
    let kind = type.split('/').pop() ?? 'Object';
    if (kind.endsWith('Node')) {
      kind = kind.slice(0, -4);
    }
    // ensure unique id
    const newId = Graphs.uniqueGraphId(graph, kind);
    //log(newId);
    if (objectId) {
      await replaceObject(layer, objectId, newId, object);
    } else {
      addObject(layer, newId, object);

    }
    // update graph
    return objectChanged(owner, layer, newId);
  }
};

const replaceObject = async (layer, objectId, newId, object) => {
  // remove objectId from layer
  await obliterateObject(layer, objectId);
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
  layer.state = Graphs.changeStateId(layer.state, objectId, newId);
};

const addObject = async (layer, newId, object) => {
  layer.graph.nodes[newId] = object;
  applyStyleToObject(layer, {l: 32, t: 32, w: 132, h: 132, /*borderWidth: 'var(--border-size-1)',*/ borderStyle: 'solid'}, newId);
};

export const cloneObject = async (owner, layer) => {
  const objectId = getSelectedObjectId(layer);
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
  const layout = graph.state[designerLayoutKey];
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
  return objectChanged(owner, layer, newId);
};

export const renameObject = async (owner, layer, {name: newId}) => {
  const objectId = getSelectedObjectId(layer);
  if (layer.graph.nodes[objectId]) {
    // remove object
    await obliterateObject(layer, objectId);  
    // rename object
    Layers.renameObject(layer, objectId, newId);
    // reanimate object
    return objectChanged(owner, layer, newId);
  }
};

const objectChanged = async (owner, layer, id) => {
  // update layout
  updateLayout(layer);
  // construct new atoms
  await reifyObject(layer, id);
  // save the graph with the new object in it
  save(layer);
};

export const updateProp = async (layer, {propId, store, value}) => {
  if (propId) {
    if (propId === 'OpenStyle') {
      updateOpenStyleProp(layer, value)
    } else if (propId.endsWith('$Container')) {
      const objectId = Id.objectIdFromAtomId(propId);
      return setObjectContainer(layer, objectId, value);
    } else if (store.$type !== 'TypeWithConnection') {
      updateDataProp(layer, propId, value);
    } else {
      await updatePropWithConnection(layer, propId, value)
    }
    save(layer);
  }
};

const updateOpenStyleProp = (layer, style) => {
  //log('In death we have a name, and that name is Robert Paulson.');
  applyStyleToObject(layer, style, getSelectedObjectId(layer));
};

const updateDataProp = (layer, propId, value) => {
  log('updateDataProp', propId, value);
  // this prop is changed in the durable graph state
  (layer.graph.state ??= {})[propId] = value;
  // this prop is changed in the live application state
  App.set(layer, Id.qualifyId(layer.name, propId), value);
};

const updatePropWithConnection = async (layer, propId, value) => {
  const objectId = Id.sliceId(propId, 0, 1);
  const {graph} = layer;
  graph.connections ??= nob();
  //
  if (value.connection?.value?.length > 0) {
    const connValue = value.connection.value;
    if (connectionsChanged(graph.connections[propId], connValue)) {
      log(`connecting '${propId}' to '${connValue?.join?.(',') ?? connValue}'`);
      graph.connections[propId] = connValue;
      // remove old state to avoid dirty checking?
      delete layer.graph.state?.[propId];
      await rebuildObject(layer, objectId);
    }
  } else {
    updateDataProp(layer, propId, value.property);
    if (graph.connections?.[propId]) {
      delete graph.connections[propId];
      await rebuildObject(layer, objectId);
    }
  }
};

const connectionsChanged = (conns1, conns2) => {
  // connections could be either a string, or an array of strings.
  const toArray = conns => Array.isArray(conns) ? conns : [conns];
  return deepEqual(new Set(toArray(conns1)), new Set(toArray(conns2)));
};

export const setGraphMeta = (layer, meta) => {
  if (layer) {
    log('assigning graph meta', meta);
    layer.graph.meta = meta;
    save(layer);
  }
};

export const recontain = async (layer, {key: objectId, value}) => {
  const container = Id.sliceId(`${value.replace(/_/g, '$')}`, 1);
  if (layer.graph.nodes[objectId] && container) {
    return setObjectContainer(layer, objectId, container);
  }
};

const validateContainer = async (layer, container) => {
  const atomId = Id.qualifyId(layer.name, container.split('#')?.[0]);
  // TODO: validate the template also has the appropriate slot in it.
  return layer.atoms[atomId]?.hasTemplate();
};

const setObjectContainer = async (layer, objectId, container) => {
  const isValidContainer = await validateContainer(layer, container);
  if (isValidContainer) {
    layer.graph.nodes[objectId].container = container;
    await rebuildObject(layer, objectId);
    save(layer);
  }
};

export const appendGraph = async(layer, {graph}) => {
  log('Appending to current graph:', graph);
  if (layer.graph.meta.description?.length && graph.meta.description?.length) {
    // TODO: Investigate GraphAgent - description isn't always saved.
    layer.graph.meta.description = `${layer.graph.meta.description} and ${graph.meta.description}`;
  }
  // Append nodes
  const mapping = {};
  entries(graph.nodes).forEach(([objectId, node]) => {
    if (objectId !== 'Main') {
      const newId = Graphs.uniqueGraphId(layer.graph, objectId);
      layer.graph.nodes[newId] = {...node};
      mapping[objectId] = newId;
    }
  });
  entries(graph.meta.graphRects).forEach(([id, rect]) => {
    layer.graph.meta.graphRects[mapping[id]] = rect;
  });
  // Append state
  entries(graph.state).forEach(([key, value]) => {
    // Append nodes' layout
    if (key === designerLayoutKey) {
      keys(value).map(objectId => {
        (layer.graph.state[designerLayoutKey] ??= {})[mapping[objectId]] = {...value[objectId]};
      });
    }
    const keyPrefix = Id.sliceId(key, 0, 1);
    if (keyPrefix !== 'Main') {
      layer.graph.state[key.replace(keyPrefix, mapping[keyPrefix])] = value;
    }
  });
  // Append connections
  entries(graph.connections).forEach(([key, bound]) => {
    const keyPrefix = Id.sliceId(key, 0, 1);
    const boundPrefix = Id.sliceId(bound, 0, 1);
    (layer.graph.connections ??= {})[key.replace(keyPrefix, mapping[keyPrefix])] = bound.replace(boundPrefix, mapping[boundPrefix]);
  });
  // Reify and save.
  values(mapping).forEach(newId => reifyObject(layer, newId));
  updateLayout(layer);
  save(layer);
};
