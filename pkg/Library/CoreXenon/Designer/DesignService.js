/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {assign, keys, nob} from '../Reactor/safe-object.js';
import {deepCopy} from '../Reactor/Atomic/js/utils/object.js';
import * as App from '../Framework/App.js';
import * as Properties from './Properties.js'
import * as Structure from './Structure.js';

// rolls over the neighbor's dog! it's log!
const log = logf('Design', 'orange', 'black');

export const DesignService = {
  SetGraphMeta(layer, atom, data) {
    return setGraphMeta(layer, data);
  },
  UpdateProp(layer, atom, data) {
    updateProp(layer, data);
  },
  LayoutChanged(layer, atom, {layout}) {
    layoutChanged(layer, layout);
  },
  DeleteSelectedObject(layer) {
    Structure.deleteObject(getDesignLayer(layer), getSelectedObjectId(layer));
  },
  MorphObject(layer, atom, data) {
    return Structure.morphObject(getDesignLayer(layer), getSelectedObjectId(layer), data);
  },
  Contain(layer, atom, data) {
    return Structure.recontain(getDesignLayer(layer), data);
  },
  RenameObject(layer, atom, data) {
    return Structure.renameObject(getDesignLayer(layer), getSelectedObjectId(layer), data);
  },
  CloneObject(layer, atom, data) {
    Structure.cloneObject(getDesignLayer(layer), getSelectedObjectId(layer));
  }
};

export const designLayerIdKey = 'base$DesignLayer$Layer$layerId';
export const simpleLayoutKey = 'Main$designer$layout';
export const getDesignLayerId = layer => App.get(layer, designLayerIdKey);
export const getDesignLayoutKey = layer => `${getDesignLayerId(layer)}\$${simpleLayoutKey}`;
export const getDesignSelectedKey = layer => `${getDesignLayerId(layer)}$Main$designer$selected`;

// (improperly) used by GraphService
export const getDesignLayer = layer => layer.flan.layers[getDesignLayerId(layer)];
const getSelectedObjectId = layer => App.get(layer, getDesignSelectedKey(layer));

const updateProp = (layer, data) => {
  const design = getDesignLayer(layer);
  const objectId = getSelectedObjectId(layer);
  if (Properties.updateProp(design, data, objectId)) {
    save(design);
  }
};

const layoutChanged = (layer, layout) => {
  // very similar to UpdateProp, except simpler:
  // - the layout is already reified into live state
  // - layout does not cross layers
  layer.graph.state[simpleLayoutKey] = layout;
  save(layer);
};

const setGraphMeta = (layer, meta) => {
  const design = getDesignLayer(layer);
  log('assigning graph meta', meta);
  design.graph.meta = meta;
  save(design);
};

export const save = layer => {
  if (layer && !layer.graph.meta.readonly) {
    const base = layer.flan.layers.base;
    if (layer.graph.meta.id === 'Bob') {
      log.error('save: attempt to save "Bob" graph')
      return;
    }
    log('save graph:', {id: layer.graph.meta.id});
    layer.graph.meta.customLibraries = gatherCustomLibraries(layer);
    const graphs = App.get(base, 'base$GraphList$graphAgent$graphs');
    const newGraph = deepCopy(layer.graph);
    const newGraphs = replaceGraph(graphs, newGraph);
    if (newGraphs) {
      App.setData(base, {
        base$GraphList$graphAgent$graph: newGraph,
        base$GraphList$graphAgent$graphs: newGraphs,
        base$NodeTypeList$typeList$graphs: newGraphs
      });
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
};

export const applyStyleToObject = (layer, style, objectId) => {
  // sanity check
  if (objectId) {
    const designLayoutKey = getDesignLayoutKey(layer);
    // layout is here
    const layout = App.get(layer, designLayoutKey) ?? nob();
    // mutatable
    const mod = deepCopy(layout);
    // create/modify entry in layout
    assign(mod[objectId] ??= nob(), style);
    // retain in designed state
    layer.graph.state[simpleLayoutKey] = mod;
    // update live state
    App.set(layer, designLayoutKey, mod);
  }
};

const gatherCustomLibraries = layer => {
  const libraries = {};
  const {customLibraries} = layer.flan.library;
  const collectLibraries = list => list.forEach(({type}) => {
    const library = extractLibraryName(type);
    if (customLibraries?.[library]) {
      libraries[library] ??= customLibraries?.[library];
    }
  });
  collectLibraries(values(layer.graph.nodes));
  collectLibraries(values(layer.system));
  return libraries;
};

const extractLibraryName = type => type.split('/')?.[0]?.substring(1);

// export const appendGraph = async(layer, {graph}) => {
//   log('Appending to current graph:', graph);
//   if (layer.graph.meta.description?.length && graph.meta.description?.length) {
//     // TODO: Investigate GraphAgent - description isn't always saved.
//     layer.graph.meta.description = `${layer.graph.meta.description} and ${graph.meta.description}`;
//   }
//   // Append nodes
//   const mapping = {};
//   entries(graph.nodes).forEach(([objectId, node]) => {
//     if (objectId !== 'Main') {
//       const newId = Graphs.uniqueGraphId(layer.graph, objectId);
//       layer.graph.nodes[newId] = {...node};
//       mapping[objectId] = newId;
//     }
//   });
//   entries(graph.meta.graphRects).forEach(([id, rect]) => {
//     layer.graph.meta.graphRects[mapping[id]] = rect;
//   });
//   // Append state
//   entries(graph.state).forEach(([key, value]) => {
//     // Append nodes' layout
//     if (key === designerLayoutKey) {
//       keys(value).map(objectId => {
//         (layer.graph.state[designerLayoutKey] ??= {})[mapping[objectId]] = {...value[objectId]};
//       });
//     }
//     const keyPrefix = Id.sliceId(key, 0, 1);
//     if (keyPrefix !== 'Main') {
//       layer.graph.state[key.replace(keyPrefix, mapping[keyPrefix])] = value;
//     }
//   });
//   // Append connections
//   entries(graph.connections).forEach(([key, bound]) => {
//     const keyPrefix = Id.sliceId(key, 0, 1);
//     const boundPrefix = Id.sliceId(bound, 0, 1);
//     (layer.graph.connections ??= {})[key.replace(keyPrefix, mapping[keyPrefix])] = bound.replace(boundPrefix, mapping[boundPrefix]);
//   });
//   // Reify and save.
//   values(mapping).forEach(newId => reifyObject(layer, newId));
//   reifyGraphLayout(layer);
//   save(layer);
// };

