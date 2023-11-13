/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from '../../Framework/Controller.js';
import * as Schema from '../../Design/Schema.js';
import * as Project from '../../../AnewLibrary/Design/Services/ProjectService.js';
import {atomInfo} from '../../../Anew/atomInfo.js';
import {makeCapName} from '../../../Library/CoreXenon/Reactor/Atomic/js/names.js';

const log = logf('DesignService', '#512E5F', 'white');

let designLayerId;
const designables = [];

const DesignTarget = {
  type: '$anewLibrary/Design/Atoms/DesignTarget',
  container: 'DesignPanels#Container'
};

const Designable = {
  type: '$anewLibrary/Graph/Atoms/Graph',
  container: 'DesignTarget#Container'
};

export const DesignService = {
  async NewGraph(host) {
    return newGraph(host.layer);
  },
  async CreateDesignable(host) {
    return createDesignable(host.layer);
  },
  async SetDesignLayerIndex(host, {index}) {
    return setDesignLayerIndex(host.layer.controller, index);
  },
  async SetDesignLayer(host, {layerId}) {
    return setDesignLayer(host.layer.controller, layerId);
  },
  Select(host, {atomId}) {
    designSelect(host.layer.controller, atomId);
  },
  async UpdateDesigner(host) {
    return designUpdate(host.layer.controller);
  },
  async GetAtomTypes() {
    const types = Object.entries(atomInfo).map(([key, info]) => ({name: key, displayName: key, ...info}));
    return {
      category: 'All',
      atoms: types
    }
  },
  async GetAtomInfo(host, data) {
    return getAtomInfo(host.layer.controller, designLayerId);
  },
  async GetLayerInfo(host, {layerId}) {
    const {controller} = host.layer;
    const schema = Schema.schemaForLayer(controller, layerId);
    const atoms = getAtomInfo(controller, layerId);
    return {atoms, schema};
  },
  DesignDragEnter(host, {eventlet}) {
    let elt = dragTarget(host, eventlet);
    if (elt) {
      elt.style.outline = '5px dashed orange';
      elt.style.outlineOffset = '-2px';
    }  
  },
  DesignDragLeave(host, {eventlet}) {
    let elt = dragTarget(host, eventlet);
    if (elt) {
      elt.style.outline = null;
    }  
  },
  async DesignDragDrop(host, {eventlet}) {
    const {controller} = host.layer;
    const types = await DesignService.GetAtomTypes();
    const dropType = types.atoms.find(({name}) => name === eventlet.value);
    log.debug(eventlet, dropType);
    if (dropType) {
      let elt = dragTarget(host, eventlet);
      if (elt) {
        elt.style.outline = null;
        elt.style.outline = '5px dashed green';
      }
      const key = eventlet.key.replace(/_/g, '$');
      let container = key.includes('#') && key;
      if (!container) {
        const targetHost = controller.atoms[key];
        container = targetHost.container;
      }
      const targetLayer = designLayerId;
      const layer = Controller.findLayer(controller, targetLayer);
      const name = dropType.name + Math.floor(Math.random()*100);
      const type = dropType.type; 
      const state = dropType.state || {};
      log.debug({name, container, state});
      // TODO(sjmiles): layer prefix is added back in Controller.reifyAtom, which
      // expects `container` to be in local-scope
      container = container.slice(targetLayer.length + 1);
      return addDesignedAtom(controller, layer, {name, type, container, state});
    }
  },
  ConnectionChange(host, {id, key, value}) {
    updateConnection(host.layer.controller, id, key, value);
  },
  PropertyChange(host, {id, key, value}) {
    updateProperty(host.layer.controller, id, key, value);
  }
};

export const newGraph = async layer => {
  const name = makeCapName();
  const graph = {      
    meta: {
      id: name
    }
  };
  Project.Project.addGraph(Project.currentProject, graph);
  Project.ProjectService.SaveProject();
  reifyGraph(layer, name);
};

export const reifyGraph = async (layer, name) => {
  const designable = await createDesignable(layer, name);
  Controller.writeInputsToHost(layer.controller, designable.id, {graphId: name});
};

export const createDesignable = async (layer, name) => {
  const {controller} = layer;
  const targetName = name + 'Target'
  const designableName = name + 'Designable';
  const targetContainer = 'DesignPanels#Container' + (designables.length > 0 ? designables.length+1 : '');
  /*const target =*/ await Controller.reifyAtom(controller, layer, {...DesignTarget, name: targetName, container: targetContainer});
  const designableContainer = targetName + '#Container';
  const designable = await Controller.reifyAtom(controller, layer, {...Designable, name: designableName, container: designableContainer});
  designables.push(layer.name + '$' + designableName);
  Controller.writeInputsToHost(controller, 'build$DesignPanels', {tabs: designables.map(d => d.split('$').slice(1).join('$').split('Designable').shift())});
  if (!designLayerId) {
    setDesignLayerIndex(controller, 0);
  }
  return designable;
};

const setDesignLayerIndex = async (controller, index) => {
  const layerId = designables[index];
  if (layerId) {
    return setDesignLayer(controller, layerId);
  }
};

const setDesignLayer = async (controller, layerId) => {
  designLayerId = layerId;
  designSelect(controller, '');
  return designUpdate(controller);
};

export const addDesignedAtom = async (controller, layer, {name, type, container, state}) => {
  const host = await Controller.reifyAtom(controller, layer, {name, type, container, state});
  layer.graph[name] = {type, container, state}; 
  designUpdate(controller);
  designSelect(controller, host.id);
  Project.ProjectService.SaveProject();
};

export const designUpdate = async controller => {
  const types = await DesignService.GetAtomTypes();
  Controller.set(controller, 'build$Catalog$Catalog', {items: [types]});
  Controller.writeInputsToHost(controller, 'build$AtomTree', {junk: Math.random()});
  Controller.writeInputsToHost(controller, 'build$NodeGraph', {layerId: designLayerId, junk: Math.random()});
};

export const designSelect = (controller, atomId) => {
  const host = controller.atoms[atomId];
  const html = !host ? '<h4 style="text-align: center; color: gray;">No selection</h4>' : `<h4 style="padding-left: .5em;">${host.id.replace(designLayerId + '$', '').replace(/\$/g, '.')}</h4>`;
  Controller.writeInputsToHost(controller, 'build$InspectorEcho', {html});
  const schema = !host ? [] : Schema.schemaForHost(host).inputs;
  const candidates = Schema.schemaForLayer(controller, designLayerId).outputs;
  Controller.writeInputsToHost(controller, 'build$PropertyInspector', {id: host?.id, schema, candidates});
  Controller.writeInputsToHost(controller, 'build$ConnectionInspector', {id: host?.id, schema, candidates});
  const state = !host ? {} : prefixedState(controller.state, host.id + '$');
  Controller.writeInputsToHost(controller, 'build$State', {object: state});
};

export const designUpdateTarget = (controller, host) => {
  const target = host.layer.id.replace('Designable', 'Target');
  Controller.writeInputsToHost(controller, target, {refresh: Math.random()});
};

const prefixedState = (state, prefix)=> {
  const prefixedState = {};
  entries(state).forEach(([id, value]) => {
    if (id.startsWith(prefix)) {
      prefixedState[id.slice(prefix.length).replace(/\$/g, '.')] = value;
    }
  });
  return prefixedState;
};

const getAtomInfo = (controller, layerId) => {
  const result = Object.entries(controller.atoms)
    .filter(([id, atom]) => id.startsWith(layerId + '$'))
    .map(([id, atom]) => ({
      id,
      type: atom.type.split('/').pop(),
      container: atom.container
    }))
  ;
  result.designLayerId = layerId;
  return result;
};

const dragTarget = (host, eventlet) => {
  const targetLayer = host.layer.selectedDesignLayerId || 'build_Design';
  const hostId = eventlet.key.includes('#') ? eventlet.key.split('#').shift() : eventlet.key;
  let elt = validTarget(document.querySelector('#' + hostId), targetLayer);
  return elt;
};

const validTarget = (elt, targetId) => {
  const root = document.querySelector(`#${targetId}`);
  if (root) { 
    if (root.contains(elt)) {
      return elt.closest('[atom]');
    }
  }
};

const updateConnection = (controller, hostId, propName, connection) => {
  // update connection in live controller
  const qualifiedConnections = { 
    [`${designLayerId}$${connection}`]: `${hostId}$${propName}`
  };
  Object.assign(controller.connections.inputs, qualifiedConnections);
  // update connection in graph data
  const hostSplit = hostId.split('$');
  const prefixId = hostSplit.slice(2).join('$');
  const atomName = hostSplit.pop();
  const host = controller.atoms[hostId];
  const hostConnections = host.layer.graph[atomName].connections ?? {};
  const graphQualifiedConnections = {
    [propName]: `${prefixId}$${connection}`
  };
  Object.assign(hostConnections, graphQualifiedConnections);
  designUpdateTarget(controller, host);
  Project.ProjectService.SaveProject();
};

const updateProperty = (controller, hostId, propName, value) => {
  // update controller state and atoms
  Controller.writeValue(controller, hostId, propName, value);
  // update graph state
  const host = controller.atoms[hostId];
  const hostSplit = hostId.split('$');
  const atomName = hostSplit.pop();
  host.layer.graph[atomName].state[propName] = value;
  log.debug(host.layer.graph[atomName]);
  designUpdateTarget(controller, host);
  Project.ProjectService.SaveProject();
};
