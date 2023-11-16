/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from '../../Framework/Controller.js';
import * as Schema from '../../Design/Schema.js';
import * as Project from '../../../AnewLibrary/Design/Services/ProjectService.js';
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
  container: 'DesignTarget#Container',
  state: {
    style: {
      overflow: 'auto'
    }
  }
};

const categoryOrder = {
  Common: 1, 
  Graph: 2,
  Layout: 5, 
  Data: 10,
  Fields: 15,
  UX: 20,
  Media: 25,
  AI: 30,
  Design: 200
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
  Delete(host, {atomId}) {
    designDelete(host.layer.controller, atomId);
  },
  async UpdateDesigner(host) {
    return designUpdate(host.layer.controller);
  },
  GetAtomTypes() {
    const types = Object.entries(Schema.atomInfo).map(([key, info]) => ({name: key, displayName: key, ...info}));
    return types;
  },
  GetAtomTypeCategories() {
    return getAtomTypeCategories();
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
    const types = DesignService.GetAtomTypes();
    const dropType = types.find(({name}) => name === eventlet.value);
    if (dropType) {
      log.debug('Dropping type', eventlet, dropType);
      await dropAtomType(host, eventlet, dropType);
    } else {
      log.debug('Dropping atom', eventlet);
      await dropAtom(host.layer.controller, eventlet);
    }
  },
  ConnectionChange(host, {id, key, value}) {
    updateConnection(host.layer.controller, id, key, value);
  },
  PropertyChange(host, {id, key, value, nopersist}) {
    updateProperty(host.layer.controller, id, key, value, nopersist);
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
  await reifyGraph(layer, name);
};

export const reifyGraph = async (layer, name) => {
  const designable = await createDesignable(layer, name);
  Controller.writeInputsToHost(layer.controller, designable.id, {graphId: name});
  return designable;
};

export const designObserver = (controller, inputs) => {
  if ('build$Catalog$Filter$query' in inputs) {
    designUpdate(controller);
  }
  if ('build$DesignPanels$tabs' in inputs) {
    const tabs = inputs.build$DesignPanels$tabs;
    for (let i=0; i<designables.length; i++) {
      if (!designables[i].endsWith(tabs[i] + 'Designable')) {
        const id = designables.splice(i--, 1);
        Controller.removeAtom(controller, controller.atoms[id]);
      }
    }
  }
};

export const createDesignable = async (layer, name) => {
  const {controller} = layer;
  controller.onwrite = designObserver.bind(this, controller);
  const targetName = name + 'Target'
  const designableName = name + 'Designable';
  const targetContainer = 'DesignPanels#Container'; // + (designables.length > 0 ? designables.length+1 : '');
  const target = await Controller.reifyAtom(controller, layer, {...DesignTarget, name: targetName, container: targetContainer});
  const designableContainer = targetName + '#Container';
  const designable = await Controller.reifyAtom(controller, layer, {...Designable, name: designableName, container: designableContainer});
  const index = designables.push(layer.name + '$' + designableName);
  Controller.writeInputsToHost(controller, 'build$DesignPanels', {selected: index-1, tabs: designables.map(d => d.split('$').slice(1).join('$').split('Designable').shift())});
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

const getDesignLayer = () => {
  return designables[designLayerId];
};

export const addDesignedAtom = async (controller, layer, {name, type, container, isContainer, state}) => {
  const host = await Controller.reifyAtom(controller, layer, {name, type, container, isContainer, state});
  layer.graph[name] = {type, container, isContainer, state}; 
  designUpdate(controller);
  designSelect(controller, host.id);
  Project.ProjectService.SaveProject();
};

const getAtomTypeCategories = filter => {
  const rawTypes = DesignService.GetAtomTypes();
  const categorized = {};
  filter = filter?.toLowerCase();
  const types = filter ? rawTypes.filter(a => a.displayName.toLowerCase().includes(filter)) : rawTypes;
  types.sort((a, b) => a.displayName.localeCompare(b.displayName));
  types.forEach(type => {
    const categories = type.categories ?? [];
    for (const category of categories) {
      (categorized[category] ??= []).push(type);
    }
  });
  const list = Object.entries(categorized).map(([category, types]) => ({
    category,
    types
  }));
  list.sort((a, b) => (categoryOrder[a.category] || 100) - (categoryOrder[b.category] || 100));
  return list;
};

export const designUpdate = async controller => {
  const categories = getAtomTypeCategories(controller.state.build$Catalog$Filter$query);
  Controller.set(controller, 'build$Catalog$Catalog', {items: categories});
  Controller.writeInputsToHost(controller, 'build$AtomTree', {junk: Math.random()});
  Controller.writeInputsToHost(controller, 'build$NodeGraph', {layerId: designLayerId, junk: Math.random()});
  const tabIndex = designables.indexOf(designLayerId);
  Controller.writeInputsToHost(controller, 'build$DesignPanels', {selected: tabIndex});
};

export const designSelect = (controller, atomId) => {
  const host = controller.atoms[atomId];
  const html = !host ? '<h4 style="text-align: center; color: gray;">No selection</h4>' : `<h4 style="padding-left: .5em;">${host.id.replace(designLayerId + '$', '').replace(/\$/g, '.')}</h4>`;
  Controller.writeInputsToHost(controller, 'build$InspectorEcho', {html});
  const schema = !host ? [] : Schema.schemaForHost(host).inputs;
  const candidates = Schema.schemaForLayer(controller, designLayerId).outputs;
  Controller.writeInputsToHost(controller, 'build$PropertyInspector', {id: host?.id, schema, candidates});
  Controller.writeInputsToHost(controller, 'build$ConnectionInspector', {id: host?.id, schema, candidates});
  Controller.writeInputsToHost(controller, 'build$AtomTree', {selected: host?.id});
  Controller.writeInputsToHost(controller, 'build$NodeGraph', {selected: host?.id});
  Controller.writeInputsToHost(controller, getDesignTargetId(), {selected: host?.id});
  const state = !host ? {} : prefixedState(controller.state, host.id + '$');
  Controller.writeInputsToHost(controller, 'build$State', {object: state});
};

export const designDelete = (controller, atomId) => {
  // update controller state and atoms
  const host = controller.atoms[atomId];
  Controller.removeAtom(controller, host);
  // update connection in graph data
  delete host.layer.graph[host.name];
  designUpdate(controller);
  designSelect(controller, null);
  Project.ProjectService.SaveProject();
};

const getDesignTargetId = () => {
  return designLayerId.replace('Designable', 'Target');
};

export const designUpdateTarget = (controller, host) => {
  Controller.writeInputsToHost(controller, getDesignTargetId(), {refresh: Math.random()});
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
    .filter(([id]) => id.startsWith(layerId + '$'))
    .map(([id, atom]) => ({
      id,
      type: atom.type.split('/').pop(),
      container: atom.meta.container,
      isContainer: atom.meta.isContainer
    }))
  ;
  result.designLayerId = layerId;
  return result;
};

const dropAtomType = async (host, eventlet, dropType) => {
  const {controller} = host.layer;
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
  const isContainer = dropType.isContainer;
  log.debug({name, container, state});
  // TODO(sjmiles): layer prefix is added back in Controller.reifyAtom, which
  // expects `container` to be in local-scope
  container = container.slice(targetLayer.length + 1);
  return addDesignedAtom(controller, layer, {name, type, container, isContainer, state});
};

const dropAtom = async (controller, eventlet, dropType) => {
  let container;
  if (eventlet.before) {
    const containerHost = controller.atoms[eventlet.key];
    container = containerHost.container;
  } else if (eventlet.after) {
    const containerHost = controller.atoms[eventlet.key];
    container = containerHost.container;
  } else if (eventlet.key.includes('#')) {
    container = eventlet.key;
  }
  if (container) {
    const containable =  controller.atoms[eventlet.value];
    containable.meta.container = container;
    await Controller.unrender(controller);
    await Controller.rerender(controller);
  }
  log.debug('Drop container', container);
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
  const source = `${designLayerId}$${connection}`;
  const target = `${hostId}$${propName}`;
  // update connection in live controller
  const connections = controller.connections.inputs;
  connections[source] = [...new Set(connections[source]).add(target)];
  // update atom state
  Controller.writeInputsToHost(controller, hostId, {[propName]: controller.state[source]});
  // update connection in graph data
  const hostSplit = hostId.split('$');
  const atomName = hostSplit.pop();
  const host = controller.atoms[hostId];
  const atomConnections = host.layer.graph[atomName].connections ??= {};
  atomConnections[propName] = [connection]; //[...new Set(atomConnections[propName]).add(connection)];
  designUpdateTarget(controller, host);
  Project.ProjectService.SaveProject();
};

const updateProperty = (controller, hostId, propName, value, nopersist) => {
  // update controller state and atoms
  Controller.writeValue(controller, hostId, propName, value);
  // update graph state
  if (!nopersist) {
    const host = controller.atoms[hostId];
    const hostSplit = hostId.split('$');
    const atomName = hostSplit.pop();
    host.layer.graph[atomName].state[propName] = value;
    log.debug(host.layer.graph[atomName]);
    designUpdateTarget(controller, host);
    Project.ProjectService.SaveProject();
  }
};
