/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {assign, entries, keys, values, map} from '../Reactor/safe-object.js';
import {makeCapName} from '../Reactor/Atomic/js/names.js';
import {TypeMatcher} from '../Framework/TypeMatcher.js';
import * as Flan from '../Framework/Flan.js';
import * as Layers from '../Framework/Layers.js';
import * as App from '../Framework/Flan.js';
import * as Graphs from '../Framework/Graphs.js';
import * as Nodes from '../Framework/Nodes.js';
import * as Id from '../Framework/Id.js';
import * as Persist from '../Framework/Persist.js';
import * as Design from '../Designer/DesignService.js';
import {Resources} from '../../Media/Resources.js';

// it's better than bad, it's good! it's log!
const log = logf('Services: GraphService', 'orangered');

export const GraphService = {
  MakeName(layer, atom, data) {
    return makeCapName();
  },
  GetGraphInfo(layer, atom, data) {
    return getGraphInfo(Design.getDesignLayer(layer), data.graph);
  },
  GetNodeInfo(layer, atom, data) {
    return getNodeInfo(Design.getDesignLayer(layer), data.objectId);
  },
  FetchNodeMeta(layer, atom, data) {
    return getNodeMeta(data.type);
  },
  async CreateLayer(layer, atom, {graph, graphId, designable}) {
    return createHostedLayer(layer, atom, graph, graphId, designable);
  },
  async SetLayerComposer(layer, atom, {layerId, composerId}) {
    return setLayerComposer(Resources.get(layerId), Resources.get(composerId));
  },
  async DestroyLayer(layer, atom, {layerId, graph}) {
    return Flan.destroyLayer(Resources.get(layerId))
  },
  // async ComputeLayerIO(layer, atom, {layerId}) {
  //   return computeLayerIO(Resources.get(layerId));
  // },
  // async CreateLayerBinding(layer, atom, {layerId, binding}) {
  //   return createLayerBinding(layer, atom, {layerId, binding});
  // },
  OpenUrl(layer, atom, data) {
    const design = Design.getDesignLayer(layer);
    // consider passing urlParam to RunInRun?
    const urls = {
      'RunInRun': '../Run',
      'ContactUs': 'https://discord.gg/PFsHCJHJdN',
      'Email': 'mailto:info@xenonjs.com',
      'BugReport': 'https://github.com/NeonFlan/xenonjs/issues/new'
    };
    const url = urls[data?.url];
    if (url) {
      let params = '';
      if (data.url === 'RunInRun') {
        params = `?graph=${graphParamForMeta(design.graph.meta)}`;
      }
      window.open(`${url}/${params}`);
    }
  },
  getNodeTypeMetas(layer, atom, data) {
    return getNodeTypeMetas(layer);
  }
};

const createHostedLayer = async (layer, atom, graph, graphId, designable, composerId) => {
  const graphSpec = graph || await loadGraph(graphId);
  if (graphSpec) {
    const id = makeCapName();
    const tempFlan = {...layer.flan};
    const newLayer = await Flan.createLayer(tempFlan, graphSpec, id);
    Resources.set(id, newLayer);
    let container = `${atom.name}#Container`;
    values(newLayer.system).forEach(spec => {
      if (spec.container?.endsWith('$root$panel#Container')) {
        spec.container = container;
      }
    });
    if (designable) {
      Flan.setUnscoped(newLayer, 'Main$designer$disabled', false);
      const designKey = `${newLayer.name}$Main$designer`;
      const designSelectedKey = `${designKey}$selected`;
      const baseKey = `${layer.name}$NodeGraph$Graph`;
      const baseSelectedKey = `${baseKey}$selected`;
      layer.bindings.input[designSelectedKey] = [baseSelectedKey];
      newLayer.bindings.input[baseSelectedKey] = [designSelectedKey];
    }
    return id;
  }
};

const setLayerComposer = async (layer, Composer) => {
  const onevent = (atomName, event) => App.handleAtomEvent(layer, atomName, event);
  layer.composer2 = new Composer();
  layer.composer2.onevent = onevent;
  Layers.rerender(layer);  
};

// const computeLayerIO = async layer => {
//   const inp = keys(layer.bindings.inputBindings).map(key => {
//     const [layerId, nodeId, atomId, propertyId] = Id.splitId(key);
//     const simpleKey = Id.joinId(nodeId, atomId, propertyId);
//     return (atomId !== 'panel' && nodeId !== 'Main') ? simpleKey : null;
//   }).filter(i=>i);
//   const outp = map(layer.bindings.outputBindings, (key, value) => {
//     const id = Id.sliceId(key, 1);
//     const props = keys(value);
//     return {id, props};
//   }).filter(i=>i);
//   return {i: inp, o: outp};
// };

// const createLayerBinding = async (layer, atom, {layerId, binding}) => {
//   const childLayer = Resources.get(layerId);
//   binding = `${childLayer.name}$DataNavigator$Form$records`;
//   layer.bindings.input[binding] = `${atom.name}$data`;
//   log('createLayerBinding:', binding, " => ", layer.bindings.input[binding]);
// };

const localPrefix = 'local:';
const fbPrefix = 'fb:';

export const graphParamForMeta = meta => {
  if (meta.readonly) {
    if (meta.ownerId) {
      return `${meta.ownerId}/${meta.id}`;
    } else {
      return meta.id;
    }
  } else {
    return `${localPrefix}${meta.id}`;
  }
};

export const loadGraph = async graphId => {
  let graph = null;
  if (graphId) {
    if (graphId.startsWith('.')) {
      const module = await import(graphId);
      graph = module.graph;
    } else if (graphId.startsWith(localPrefix)) {
      graph = await restoreLocalGraph(graphId.slice(localPrefix.length));
    } else if (graphId.startsWith(fbPrefix)) {
      graph = await fetchFbGraph(graphId.slice(fbPrefix.length));
    } else {
      // Default to trying to fetch the graph from firebase.
      graph = await fetchFbGraph(graphId);
    }
    if (graph) {
      graph.state.Main$designer$disabled = true;
    }
  }
  return graph;
};

const restoreLocalGraph = async (id) => {
  return Persist.restoreValue(`base$GraphList$graphAgent$graphs.${id}`);
};

const fetchFbGraph = async (id) => {
  const firebaseUrl = `${globalThis.config.firebaseConfig.databaseURL}/${globalThis.config.publicGraphsPath}`;
  if (firebaseUrl) {
    const url = `${firebaseUrl}/${id}.json`;
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        const text = await res.text();
        const graph = text && JSON.parse(text.replace(/%/g, '$'));
        if (graph) {
          return (typeof graph === 'string') ? JSON.parse(graph) : graph;
        }
      }
    } catch(x) {}
    return findFbGraph(firebaseUrl, id);
  }
};

const findFbGraph = async (firebaseUrl, id) => {
  const res = await fetch(`${firebaseUrl}.json`);
  if (res.status === 200) {
    const text = (await res.text())?.replace(/%/g, '$');
    const graphs = JSON.parse(text);
    for (const userGraphs of values(graphs)) {
      if (userGraphs[id]) {
        return JSON.parse(userGraphs[id]);
      }
    }
  }
};

const getGraphInfo = async (layer, graph) => {
  graph ??= layer?.graph;
  const system = graph ? await Graphs.graphToAtomSpecs(graph, '') : {};
  entries(system).forEach(([id, meta]) => {
    const objectId = Id.sliceId(id, 1, 2);
    assign(meta, getNodeType(graph.nodes[objectId].type));
  });
  return {system};
};

const getNodeTypes = layer => {
  return (layer ?? globalThis).flan.state.base$NodeTypeList$typeList$nodeTypes || {};
};

const getNodeType = type => {
  return values(getNodeTypes()).find(nodeType => nodeType.type === type);
};

const getNodeMeta = async (type) => {
  const meta = await Nodes.getNodeMeta(type);
  return {...meta, ...getNodeType(type)};
};

const getNodeTypeMetas = async (layer) => {
  const specs = {};
  for (let [id, spec] of entries(getNodeTypes(layer))) {
    const meta = await Nodes.getNodeMeta(spec.type);
    (specs[spec.category]??= {})[id] = {...meta, ...spec};
  }
  return specs;
};

const getNodeInfo = async (layer, objectId) => {
  const info = {atoms: {}, objectInfo: {}};
  if (layer) {
    const {atoms, graph} = layer;
    // this 'system' is not the same as layer.system, because graph has changed
    // surgically and system is not updated
    const system = graph ? await Graphs.graphToAtomSpecs(graph, layer.name) : {};
    const systemCandidates = {};
    for (let qualifiedAtomId of keys(layer.atoms)) {
      const atomId = Id.sliceId(qualifiedAtomId, 1);
      const atomName = Id.sliceId(atomId, 1);
      const atomObjectId = Id.objectIdFromAtomId(atomId);
      const atomInfo = system[qualifiedAtomId];
      const nodeType = getNodeType(graph.nodes[atomObjectId].type);
      system[qualifiedAtomId].outputs?.forEach(name => {
        const type = nodeType?.types?.[Id.qualifyId(atomName, name)] || 'Pojo';
        (systemCandidates[type] ??= []).push({name, objectId: atomObjectId, atomId, key: Id.qualifyId(atomId, name), type});
      });

      if (objectId === atomObjectId) {
        info.atoms[atomId] = {...atomInfo, ...nodeType};
        // capture atom:hasTemplate() into objectInfo.objectId map
        (info.objectInfo[objectId]??= {}).hasTemplate ||= await (atoms[qualifiedAtomId]?.hasTemplate());
      }
    }
    entries(info.atoms).forEach(([atomId, atomInfo]) => {
      const atomName = Id.sliceId(atomId, 1);
      atomInfo.candidates = constructCandidates(atomName, atomInfo, systemCandidates);
    });
  }
  return info;
};

const constructCandidates = (atomName, {types, inputs}, systemCandidates) => {
  const candidates = {};
  if (systemCandidates) {
    inputs?.forEach(prop => {
      const propType = types?.[Id.qualifyId(atomName, prop)] || 'Pojo';
      candidates[propType] ??= chooseCandidatesForType(propType, systemCandidates);
    });
  }
  return candidates;
};

const chooseCandidatesForType = (type, candidates) => {
  return entries(candidates)
      .filter(([candidateType, _]) => TypeMatcher(type, candidateType))
      .map(([_, candidates]) => candidates)
      .flat();
};
