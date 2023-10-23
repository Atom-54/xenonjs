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
  async CreateLayer(layer, atom, {graph, graphId, designable}) {
    return createHostedLayer(layer, atom, graph, graphId, designable);
  },
  async GetLayerGraph(layer, atom, {layerId}) {
    return Resources.get(layerId)?.graph;
  },
  GetLayerIO(layer, atom, {layerId}) {
    const designLayer = Design.getDesignLayer(layer);
    return computeAllProperties(designLayer);
    //const realLayer = Resources.get(layerId);
    //return computeAllProperties(realLayer);
  },
  async SetLayerComposer(layer, atom, {layerId, composerId}) {
    return setLayerComposer(Resources.get(layerId), Resources.get(composerId));
  },
  async DestroyLayer(layer, atom, {layerId, graph}) {
    return Flan.destroyLayer(Resources.get(layerId))
  },
  GetGraphInfo(layer, atom, data) {
    return getGraphInfo(Design.getDesignLayer(layer), data.graph);
  },
  GetNodeInfo(layer, atom, data) {
    const designLayer = Design.getDesignLayer(layer);
    //computeAllProperties(designLayer);
    return getNodeInfo(designLayer, data.objectId);
  },
  FetchNodeMeta(layer, atom, data) {
    return getNodeMeta(data.type);
  },
  getNodeTypeMetas(layer, atom, data) {
    return getNodeTypeMetas(layer);
  },
  // async ComputeLayerIO(layer, atom, {objectId}) {
  //   const design = Design.getDesignLayer(layer);
  //   const layerIdProp = Id.joinId(design.name, objectId, 'layerId');
  //   const sublayerId = Flan.get(layer, layerIdProp); 
  //   log.debug(layerIdProp, sublayerId);
  //   //Flan.get(layer, get()
  //   //design.nodes[objecI]
  //   //return computeLayerIO(, objectId);
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
  }
};

const createHostedLayer = async (layer, atom, graph, graphId, designable, composerId) => {
  const graphSpec = graph || await loadGraph(graphId);
  if (graphSpec) {
    //const id = Id.sliceId(atom.name, 1).replace(/\$/g, '');
    const id = makeCapName();
    //const id = makeCapName() + atom.name.replace(/\$/g, '');
    //const id = 'GiggleBox' + atom.name.replace(/\$/g, '');
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

// TODO(sjmiles): name is confusing ... is a very specific tranche of data
// used in NodeGraph
const getGraphInfo = async (layer, graph) => {
  // is graph is null, use layer graph
  graph ??= layer?.graph;
  // get mapped atom specs
  const system = graph ? await Graphs.graphToAtomSpecs(graph, '') : {};
  // meta fixup
  entries(system).forEach(([atomId, meta]) => {
    // snatch out the object name <layer><object>[<atom>]
    const objectId = Id.sliceId(atomId, 1, 2);
    // TODO(sjmiles): redundant calculations
    const node = graph.nodes[objectId];
    // merge the nodeType record to the atom meta
    assign(meta, getNodeType(node.type));
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

// TODO(sjmiles): name is confusing ... is a very specific tranche of data
// used in NodeInspectorAdaptor
const getNodeInfo = async (layer, objectId) => {
  // result object
  const info = {
    atoms: {}, 
    objectInfo: {}
  };
  // if there's a layer at all
  if (layer) {
    // get all the property and type info for layer
    const io = computeAllProperties(layer);
    // connection candidates
    const systemCandidates = {};
    // for layer atoms
    // entries(layer.atoms)
    //   // skip this one
    //   .filter(([key]) => !key.startsWith('Main$panel'))
    //   // find candidates by type
    //   .map(([atomId, atom]) => {
    //     const atomSpec = layer.system[atomId];
    //     const simpleId = Id.sliceId(atomId, 1);
    //     atomSpec.inputs?.forEach(prop => {
    //       const id = Id.joinId(simpleId, prop);
    //       const type = io.i[id];
    //       const candidates = chooseCandidatesForType(type, io.t);
    //       log.debug(id, type, candidates);
    //     });
    //   })
    //   ;
    //
    const {atoms, graph} = layer;
    const node = graph.nodes[objectId];
    const nodeType = getNodeType(node.type);
    info.objectInfo.nodeType = nodeType;
    const propTypes = nodeType?.types ?? {};
    // this 'system' is not the same as layer.system, because 
    // graph has changed surgically and system is not updated
    // TODO(sjmiles): ^ what?
    //const system = graph ? await Graphs.graphToAtomSpecs(graph, layer.name) : {};
    // connection candidates
    // const systemCandidates = {};
    // find connection candidates in Layer
    // keys(layer.atoms)
    //   .filter(key => !key.startsWith('Main$panel'))
    //   .map(atomId => {})
    //   ;
    // log.debug()
    // map(layer.atoms, (atomId, atom) => {
    //   if (!(atomId === 'panel' && nodeId === 'Main')) {
    //     log.debug(atomId, atom);
    //   }
    // });
    // for *all* atoms in layer (all atoms are iterated to find all candidates)
    // for (let qualifiedAtomId of keys(layer.atoms)) {
    //   // atom meta from local system
    //   const atomInfo = system[qualifiedAtomId];
    //   // unqualified atomId
    //   const atomId = Id.sliceId(qualifiedAtomId, 1);
    //   // actual atom
    //   const atom = atoms[qualifiedAtomId];
    //   // blerf
    //   await thngTheQual(layer, objectId, info, qualifiedAtomId, atom, atomInfo, atomId, propTypes, systemCandidates);
    // }
    const objectPrefix = Id.joinId(layer.name, objectId);
    for (let qualifiedAtomId of keys(layer.atoms)) {
      if (Id.startsWithId(qualifiedAtomId, objectPrefix)) {
        // atom meta from local system
        const atomInfo = layer.system[qualifiedAtomId];
        // unqualified atomId   
        const atomId = Id.sliceId(qualifiedAtomId, 1);
        // actual atom
        const atom = atoms[qualifiedAtomId];
        info.objectInfo.hasTemplate ||= Boolean(atom.template);
        info.atoms[atomId] = {
          ...atomInfo,
          ...nodeType
        };
        // blerf
        //await thngTheQual(layer, objectId, info, qualifiedAtomId, atom, atomInfo, atomId, propTypes, systemCandidates);
      }
    }
    // post-process info.atoms
    entries(info.atoms).forEach(([atomId, atomInfo]) => {
      //const atomName = Id.sliceId(atomId, 1);
      atomInfo.candidates = io.t; //constructCandidates(atomName, atomInfo, systemCandidates);
    });
    log.debug('getNodeInfo', layer.name, objectId);
    log.debug(info);
  }
  return info;
};

// const constructCandidates = (atomName, {types, inputs}, systemCandidates) => {
//   const candidates = {};
//   if (systemCandidates) {
//     inputs?.forEach(prop => {
//       const propType = types?.[Id.qualifyId(atomName, prop)] || 'Pojo';
//       candidates[propType] ??= chooseCandidatesForType(propType, systemCandidates);
//     });
//   }
//   return candidates;
// };

// const chooseCandidatesForType = (type, candidates) => {
//   return entries(candidates)
//     .filter(([candidateType, _]) => TypeMatcher(type, candidateType))
//     .map(([_, candidates]) => candidates)
//     .flat()
//     ;
// };

// const thngTheQual = async (layer, objectId, info, qualifiedAtomId, atom, atomInfo, atomId, propTypes, systemCandidates) => {
//   // id parts
//   const [atomObjectId, atomName] = Id.splitId(atomId);
//   // map atom outputs as connection candidates by type
//   atomInfo.outputs?.forEach(name => {
//     // property name
//     const propName = Id.qualifyId(atomName, name);
//     const type = propTypes?.[propName] || 'Pojo';
//     const candidates = (systemCandidates[type] ??= []);
//     candidates.push({
//       name, 
//       type,
//       atomId, 
//       objectId: atomObjectId, 
//       key: Id.qualifyId(atomId, name)
//     });
//   });
//   let io;
//   const isLayerAtom = atomInfo.type.endsWith('Layer');
//   if (isLayerAtom) {
//     const layerIdProp = Id.joinId(qualifiedAtomId, 'layerId');
//     const layerId = Flan.get(layer, layerIdProp);
//     const sublayer = flan.layers[layerId];
//     io = await computeLayerIO(sublayer);
//     // build types for properties which are stored with the nodes
//     //const newInfo = info.atoms[atomId]
//     const nodes = sublayer.graph.nodes;
//     for (let [id, node] of entries(nodes)) {
//       const nodeTypes = getNodeType(node.type)?.types || {};
//       map(nodeTypes, (name, value) => {
//         const key = Id.joinId(atomObjectId, Id.splitId(name).join('::'));
//         propTypes[key] = value;
//       });
//     }
//     //const [atomId, atom] = entries(nodeInfo.atoms)[0];
//     io.o.forEach(name => {
//       // property name
//       const propName = Id.splitId(Id.sliceId(name, 1)).join('::');
//       const type = propTypes?.[propName] || 'Pojo';
//       const candidates = (systemCandidates[type] ??= []);
//       candidates.push({
//         name: propName, 
//         type,
//         atomId, 
//         objectId: atomObjectId, 
//         key: Id.qualifyId(atomObjectId, propName)
//       });
//     });
//     // for (let output of io.o) {
//     //   const bits = input.split('$').slice(1);
//     //   const name = bits.join('::');
//     //   const prop = this.newProp(objectId, graph.connections, atomId, atom, name, graph.state);
//     //   props.push(prop);
//     // }
//   }
//   // if this atom belongs to objectId
//   if (objectId === atomObjectId) {
//     //info.objectInfo.io = io;
//     // capture atom:hasTemplate() into objectInfo
//     info.objectInfo.hasTemplate ||= await (atom?.hasTemplate());
//     // store atom info
//     /*const newInfo =*/ info.atoms[atomId] = {...atomInfo, ...info.objectInfo.nodeType};
//     //if (isLayerAtom) {
//       //log.debug('getNodeInfo on LayerAtom');
//       //log.debug('layerid is ', layerId);
//       //log.debug('io is', io);
//     //}
//   }
// };

// const computeLayerIO = async layer => {
//   const computeIO = io => keys(io).map(key => {
//     const [layerId, nodeId, atomId, propertyId] = Id.splitId(key);
//     const simpleKey = Id.joinId(nodeId, atomId, propertyId);
//     return !(atomId === 'panel' && nodeId === 'Main') ? simpleKey : null;
//   }).filter(i=>i);
//   const i = computeIO(layer.bindings.input);
//   const o = computeIO(layer.bindings.output);
//   return {i, o};
// };

const computeAllProperties = layer => {
  log.debug('computeAllProperties for', layer.name);
  // Collate type data
  const types = collectAllTypes(layer);
  log.debug(types);
  // Standard props
  const props = {
    outputs: keys(layer.bindings.output), 
    inputs: keys(layer.bindings.input)
  };
  // More props may be hidden inside LayerNodes
  const sublayerPropStratified = map(layer.graph.nodes, (name, node) => {
    if (node.type.endsWith('LayerNode')) {
      const requalify = keys => keys.map(key => Id.joinId(`[${name}]`, Id.sliceId(key, 1)));
      const sublayer = fetchIndirectLayer(layer, name);
      return {
        outputs: requalify(keys(sublayer.bindings.output)), 
        inputs: requalify(keys(sublayer.bindings.input))
      };
    }
  });
  // combine sublayer props with standard props
  sublayerPropStratified.filter(i=>i).forEach(strata => {
    props.outputs.push(...strata.outputs);
    props.inputs.push(...strata.inputs);
  });
  // map property names to types, memoize untyped props
  const pojoProps = [];
  const typeify = propset => propset.reduce((io, prop) => {
    const simplifed = Id.sliceId(prop, 1);
    let type = types[simplifed];
    if (!type) {
      pojoProps.push(simplifed);
      type = 'Pojo';
    }
    io[simplifed] = type;
    return io;
  }, {});
  // map types to property names
  const propsByType = entries(types).reduce((propsByType, [name, type]) => {
    (propsByType[type] ??= []).push(name);
    return propsByType;
  }, {});
  // this information assists with building connections
  const io = {
    i: typeify(props.inputs),
    o: typeify(props.outputs),
    t: propsByType
  };
  propsByType.Pojo = pojoProps;
  log.debug(io);
  return io;
};

const collectAllTypes = layer => {
  let allTypes = {};
  map(layer.graph.nodes, (nodeId, node) => {
    const nodeType = getNodeType(node.type);
    // add nodeTypes
    map(nodeType?.types, (name, value) => {
      if (!name.endsWith('Values')) {
        allTypes[Id.joinId(nodeId, name)] = value;
      }
    });
    // add sublayer types
    if (node.type.endsWith('LayerNode')) {
      const layerIdProp = Id.joinId(layer.name, nodeId, 'Layer', 'layerId');
      const layerId = Flan.get(layer, layerIdProp);
      const sublayer = flan.layers[layerId];
      for (let node of values(sublayer.graph.nodes)) {
        const nodeTypes = getNodeType(node.type)?.types || {};
        map(nodeTypes, (name, value) => {
          if (!name.endsWith('Values')) {
            const key = Id.joinId(`[${nodeId}]`, name);
            allTypes[key] = value;
          }
        });
      }
    }
  });
  return allTypes;
};

const fetchIndirectLayer = (hostLayer, layerNodeName) => {
  const targetLayerIdProp = Id.joinId(hostLayer.name, layerNodeName, 'Layer', 'layerId');
  const targetLayerId = hostLayer.flan.state[targetLayerIdProp];
  const targetLayer = Resources.get(targetLayerId);
  return targetLayer;
};