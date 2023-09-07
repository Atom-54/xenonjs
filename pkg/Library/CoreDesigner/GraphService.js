/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {SafeObject} from 'xenonjs/Library/CoreReactor/safe-object.js';
import {makeCapName} from 'xenonjs/Library/CoreReactor/Atomic/js/names.js';
import {TypeMatcher} from 'xenonjs/Library/CoreFramework/TypeMatcher.js';
import * as Graphs from 'xenonjs/Library/CoreFramework/Graphs.js';
import * as Nodes from 'xenonjs/Library/CoreFramework/Nodes.js';
import * as Design from 'xenonjs/Library/CoreDesigner/DesignApp.js';
import * as Id from 'xenonjs/Library/CoreFramework/Id.js';
import * as App from '../CoreFramework/App.js';
import {Resources} from '../Media/Resources.js';
import {graph as Poetry} from '../../Graphs/Poetry.js';

// rolls over the neighbor's dog! it's log!
const log = logf('GraphService', 'orangered');
log.flags.GraphService = true;

// be pithy
const {assign, entries, keys, values} = SafeObject;

export const GraphService = {
  CreateLayer(layer, atom, data) {
    const newLayer = App.createLayer.simple(Poetry, id);
    const id = Resources.allocate(newLayer);
    return {layer: id};
  },
  MakeName(layer, atom, data) {
    return makeCapName();
  },
  SetGraphMeta(layer, atom, data) {
    return Design.setGraphMeta(globalThis.design, data);
  },
  GetGraphInfo(layer, atom, data) {
    return getGraphInfo(globalThis.design, data.graph);
  },
  GetNodeInfo(layer, atom, data) {
    return getNodeInfo(globalThis.design, data.objectId);
  },
  FetchNodeMeta(layer, atom, data) {
    return getNodeMeta(data.type);
  },
  SelectGraph(layer, atom, data) {
    if (layer.name === '') {
      log('SelectGraph', data);
      return Design.designGraph(layer, data.graph);
    }
  },
  UnselectGraph(layer, atom, data) {
    if (layer.name === '') {
      log('UnselectGraph', data);
      return Design.obliterateGraph(layer, data.graph);
    }
  },
  // AddObject(layer, atom, data) {
  //   return Design.addObject(layer, globalThis.design, data?.node, data?.style);
  // }, 
  MorphObject(layer, atom, data) {
    if (globalThis.design && !isDesignMainSelected(globalThis.design)) {
      return Design.morphObject(layer, globalThis.design, data);
    }
  },
  CloneObject(layer, atom, data) {
    if (!isDesignMainSelected(globalThis.design)) {
      return Design.cloneObject(layer, globalThis.design, data);
    }
  },
  RenameObject(layer, atom, data) {
    if (!isDesignMainSelected(globalThis.design)) {
      return Design.renameObject(layer, globalThis.design, data);
    }
  },
  DeleteObject(layer, atom, data) { 
    if (!isDesignMainSelected(globalThis.design)) {
      return Design.removeObject(globalThis.design);
    }
  },
  UpdateProp(layer, atom, data) {
    return Design.updateProp(globalThis.design??layer, data);
  },
  Contain(layer, atom, data) {
    return Design.recontain(globalThis.design, data);
  },
  OpenUrl(layer, atom, data) {
    const urls = {
      'RunInRun': '../Run/',
      'ContactUs': 'https://discord.gg/PFsHCJHJdN',
      'Email': 'mailto:info@xenonjs.com',
      'BugReport': 'https://github.com/NeonFlan/xenonjs/issues/new'
    };
    if (urls[data]) {
      window.open(urls[data]);
    }
  },
  getNodeTypeMetas(layer, atom, data) {
    return getNodeTypeMetas(layer);
  },
  AppendGraph(layer, atom, data) {
    return Design.appendGraph(globalThis.design, data);
  }
};

const isDesignMainSelected = (layer) => {
  return Design.getSelectedObjectId(layer) === Design.designerId;
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
  return globalThis.app?.state?.$NodeTypeList$typeList$nodeTypes;
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
        const type = nodeType.types?.[Id.qualifyId(atomName, name)] || 'Pojo';
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
