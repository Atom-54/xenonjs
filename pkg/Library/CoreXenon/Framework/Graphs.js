/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Id from './Id.js';
import * as Nodes from './Nodes.js';
import {entries, create} from '../Reactor/safe-object.js';
import {deepMerge, deepCopy} from '../Reactor/Atomic/js/utils/object.js';

const log = logf('Graphs', '#8f43ee');
log.flags.Graphs = true;

const mapKeyValue = (o, at) => entries(o).map(([key, value], i) => at(key, value, i, o));
const mapKeyValueAsync = (o, at) => Promise.all(mapKeyValue(o, at));

// graphs

export const graphToAtomSpecs = async (graph, id) => {
  // now generate set of AtomMetas for export
  const atomSpecs = create(null);
  // job to get atom specifics
  const specify = async (key, value) => nodeTypeToAtomSpecs(id, atomSpecs, key, value);
  // specify all the graph.nodes, let the jobs complete in parallel
  await mapKeyValueAsync(graph.nodes, specify);
  // dem AtomMetas
  return atomSpecs;
};

// create `atomSpecs` for Node descriptor
export const nodeTypeToAtomSpecs = async (id, atomSpecs, key, {type, container}) => {
  // convert `type` to node `meta`
  const meta = await Nodes.getNodeMeta(type);
  // atom spec configuration
  key = Id.qualifyId(id, key);
  container = container
      ? Id.isQualifiedId(container) ? container : Id.qualifyId(id, container)
      : null;
  // get the specs
  await nodeMetaToAtomSpecs(key, meta, container, atomSpecs);
};

export const getDesignerId = graph => graph.meta.designerId;

export const uniqueGraphId = (graph, id) => {
  return uniqifyId(id, graph?.nodes);
};

const uniqifyId = (id, nodes) => {
  let unique = id;
  for (let i=0; (unique=`${id}${i?i+1:''}`) && nodes[unique]; i++);
  return unique;
};

// node meta 

const keyword = {types:1, meta:1, state:1, description:1};

const nodeMetaToAtomSpecs = async (key, meta, container, atoms) => {
    // for each entry in the NodeMeta
  mapKeyValue(meta, (name, value) => {
    // skip keywords
    if (!keyword[name]) {
      // otherwise, it's atom spec
      const atom = {...value};
      // node-level container wins, but it needs a ObjectId prefix
      const c = value.container ? Id.qualifyId(key, value.container) : container;
      if (c) {
        atom.container = c;
      }
      // point back to Node's defs
      if (meta.types) {
        atom.types = meta.types;
      }
      // log(`${key}$${name}`, atom.container, container);
      atoms[Id.qualifyId(key, name)] = atom;
    }
  });
};

export const getGraphState = (/*layerId, */graph) => {
  return graph.state;
};

export const getNodeState = async (/*layerId,*/ graph) => {
  const state = create(null);
  const nodeStateVisitor = async (id, spec) => nodeToNodeState(/*Id.qualifyId(layerId, id)*/id, spec.type, state);
  await mapKeyValueAsync(graph.nodes, nodeStateVisitor);
  return state;
};

export const nodeToNodeState = async (id, type, state) => {
  const node = await Nodes.getNodeMeta(type);
  mapKeyValue(node?.state, (key, value) => state[Id.qualifyId(id, key)] = value);
  return state;
};

export const qualifyState = (layerId, state) => {
  const qualified = create(null);
  for (const key in state) {
    qualified[Id.qualifyId(layerId, key)] = state[key];
  }
  return qualified;
};

export const union = graphs => {
  return graphs.reduce((graph, layer) => {
    if (!graph) {
      // make a base
      graph = deepCopy(layer);
    } else {
      // Scary graph union
      // TODO(sjmiles): we should test for key conflicts here?
      deepMerge(graph, layer);
    }
    return graph;
  }, null);
};

export const recontainObjects = (graph, fromObjectId, toContainer) => {
  const objectIds = [];
  entries(graph.nodes).forEach(([id, node]) => {
    if (Id.matchesIdPrefix(node.container, fromObjectId)) {
      node.container = toContainer;
      objectIds.push(id);
    }
  });
  return objectIds;
};

export const changeObjectId = (graph, oldId, newId) => {
  log.groupCollapsed('changeObjectId', oldId, newId);
  //log(keys(graph));
  // graph has: (1) meta, (2) nodes, (3) state, (4) connections
  // (1) META
  const meta = {
    ...graph.meta,
    graphRects: changeGraphRectId(graph.meta, oldId, newId)
  };
  // (2) NODES
  const nodes = entries(graph.nodes).reduce((mod, [key, value]) => {
    const k = key === oldId ? newId : key;
    // nodes have (a) type and (b) container
    mod[k] = {...value};
    // (a) type is orthogonal
    // (b) container
    if (value.container) {
      mod[k].container = twiddle(value.container, oldId, newId);
    }
    return mod;
  }, create(null));
  log('nodes', nodes);
  // (3) STATE
  //log(graph.state);
  const state = changeStateId(graph?.state, oldId, newId);
  // (4) CONNECTIONS 
  //log(graph.connections);
  const connections = entries(graph.connections).reduce((mod, [key, value]) => {
    mod[twiddle(key, oldId, newId)] = twiddle(value, oldId, newId);
    return mod;
  }, create(null));
  log('connections:', connections);
  log.groupEnd();
  return {
    meta,
    nodes,
    state,
    connections        
  };
};

export const changeStateId = (state, oldId, newId) => {
  log.groupCollapsed('changeStateId', oldId, newId);
  // (3) STATE
  //log(graph.state);
  const state0 = entries(state).reduce((mod, [key, value]) => {
    mod[twiddle(key, oldId, newId)] = twiddleValue(value, oldId, newId);
    return mod;
  }, create(null));
  // (3b) layout in STATE
  //log(graph.layout);
  const state1 = entries(state0).reduce((mod, [key, value]) => {
    if (key.endsWith('designer$layout')) {
      const layout = entries(value).reduce((mod, [key, value]) => {
        mod[key === oldId ? newId : key] = value;
        return mod;
      }, create(null));
      delete layout[oldId];
      log('twornked state layout', key, layout);
      value = layout;
    }
    mod[key] = value;
    return mod;
  }, create(null));
  log('state:', state1);
  log.groupEnd();
  return state1;
};

const changeGraphRectId = ({graphRects}, oldId, newId) => {
  if (graphRects?.[oldId]) {
    graphRects[newId] = graphRects[oldId];
    delete graphRects[oldId];
  }
  return graphRects;
};

const twiddle = (key, oid, newOid) => {
  const fix = key => {
    if (Id.matchesIdPrefix(key, oid)) {
      return key.replace(oid, newOid);
    }
    return key;
  }
  if (Array.isArray(key)) {
    return key.map(k => fix(k));
  } else {
    return fix(key);
  }
};

const twiddleValue = (value, oid, newOid) => {
  if (Array.isArray(value)) {
    return value.map(v => twiddleValue(v, oid, newOid));
  } else if (typeof value === 'object') {
    return entries(value).reduce((mod, [key, value]) => {
      mod[twiddle(key, oid, newOid)] = twiddleValue(value, oid, newOid);
      return mod;
    }, create(null));
  } else if (typeof value === 'string') {
    return twiddle(value, oid, newOid);
  }
  return value;
};
