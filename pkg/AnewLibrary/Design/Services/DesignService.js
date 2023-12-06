/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import {makeCapName} from '../../CoreXenon/Reactor/Atomic/js/names.js';
import * as Library from '../../Xenon/Library.js';
import * as Controller from '../../Framework/Controller.js';
import * as Schema from '../Schema.js';
import * as Graph from '../Graph.js';
import * as Project from './ProjectService.js';

const log = logf('DesignService', '#512E5F', 'white');

export let designLayerId, designSelectedHost;
export const sublayers = [];

const DesignTarget = {
  type: '$anewLibrary/Design/Atoms/DesignTarget',
  container: 'DesignPanels#Container'
};

const Sublayer = {
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
  Designer: 200
};

export const DesignService = {
  async SetDesignLayerIndex(host, {index}) {
    setDesignLayerIndex(host.layer.controller, index);
    return designUpdate(host.layer.controller);
  },
  async NewGraph(host) {
    return newGraph(host.layer);
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
  GetAtomTypeCategories() {
    return getAtomTypeCategories();
  },
  async GetAtomInfo(host, data) {
    return getAtomInfo(host.layer.controller, designLayerId);
  },
  async GetAtomGraphInfo(host, {layerId}) {
    const layer = Controller.findLayer(host.layer.controller, layerId);
    return getGraphMetaData(layer.graph, 'atomGraphInfo');
  },
  async SetAtomGraphInfo(host, {layerId, info}) {
    const layer = Controller.findLayer(host.layer.controller, layerId);
    return setGraphMetaData(layer.graph, 'atomGraphInfo', info);
  },
  async GetLayerInfo(host, {layerId}) {
    const {controller} = host.layer;
    const schema = Schema.schemaForLayer(controller, layerId);
    const atoms = getAtomInfo(controller, layerId);
    const connections = controller.connections;
    return {atoms, schema, connections};
  },
  async DesignDragDrop(host, {eventlet}) {
    const types = getAtomTypes();
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
    if (key === 'name') {
      renameAtom(host, id, value)
    } else {
      updateProperty(host.layer.controller, id, key, value, nopersist);
    }
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
  await reifyGraph(layer, name);
  Controller.writeInputsToHost(layer.controller, 'build$DesignPanels', {selected: sublayers.length-1});
  Project.saveProject(Project.currentProject);
};

export const loadGraph = async (layer, name) => {
  await reifyGraph(layer, name);
  validateAtomOrder(layer.controller);
  designUpdate(layer.controller);
  Controller.writeValue(layer.controller, 'build$DesignPanels', 'selected', sublayers.length-1);
};

export const reifyGraph = async (layer, name) => {
  const sublayer = await createSublayer(layer, name);
  Controller.writeInputsToHost(layer.controller, sublayer.id, {graphId: name});
  return sublayer;
};

export const getGraphMetaData = (graph, property) => {
  return graph.meta[property];
};

export const setGraphMetaData = async (graph, property, value) => {
  graph.meta[property] = value;
  return Project.saveProject(Project.currentProject);
};

const createSublayer = async (layer, name) => {
  const {controller} = layer;
  controller.onwrite = designObserver.bind(this, controller);
  const sublayerName = name;
  const targetName = name + 'Target'
  const targetContainer = 'DesignPanels#Container';
  const state = {style: {order: sublayers.length}};
  delete controller.state['build$' + targetName + '$style'];
  const target = await Controller.reifyAtom(controller, layer, {...DesignTarget, name: targetName, container: targetContainer, state});
  const sublayerContainer = targetName + '#Container';
  const sublayer = await Controller.reifyAtom(controller, layer, {...Sublayer, name: sublayerName, container: sublayerContainer});
  sublayers.push(layer.name + '$' + sublayerName);
  return sublayer;
};

const setDesignLayerIndex = async (controller, index) => {
  const layerId = sublayers[index];
  if (layerId) {
    designLayerId = layerId;
    designSelect(controller, '');
  }
};

export const getDesignLayer = controller => {
  return Controller.findLayer(controller, designLayerId);
};

export const addDesignedAtom = async (controller, layer, {name, type, container, containers, state}) => {
  const host = await Controller.reifyAtom(controller, layer, {name, type, container, containers, state});
  layer.graph[name] = {type, container, containers, state}; 
  designUpdate(controller);
  designSelect(controller, host.id);
  Project.saveProject(Project.currentProject);
};

const getAtomTypes = () => {
  return Object.entries(Library.atomInfo).map(([key, info]) => ({name: key, displayName: key, ...info}));
};

const getAtomTypeCategories = filter => {
  const rawTypes = getAtomTypes();
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
  list.sort((a, b) => {
    const [coa, cob] = [categoryOrder[a.category], categoryOrder[b.category]];
    if (coa || cob) {
      return (coa || 100) - (cob || 100);
    }
    return a.category.localeCompare(b.category);
  });
  return list;
};

const designObserver = (controller, inputs) => {
  if ('build$CodeEditor$text' in inputs) {
    const qualifiedId = controller.state.build$CodeEditor$id;
    if (qualifiedId) {
      const parts = qualifiedId.split('$');
      const key = parts.pop();
      const id = parts.join('$');
      log.debug('designObserver: updating property text for', id, key);
      updateProperty(controller, id, key, inputs.build$CodeEditor$text);
    }
  }
  if ('build$Catalog$Filter$query' in inputs) {
    designUpdate(controller);
  }
  if ('build$DesignPanels$tabs' in inputs) {
    const tabs = inputs.build$DesignPanels$tabs;
    if (tabs.length < sublayers.length) {
      for (let i=0; i<sublayers.length; i++) {
        const suffix = tabs[i];
        if (!sublayers[i].endsWith(suffix)) {
          const sublayerId = sublayers[i];
          log.debug('remove layer #', i, sublayerId);
          sublayers.splice(i--, 1);
          removeAtom(controller, sublayerId);
          removeAtom(controller, sublayerId + 'Target');
        }
      }
      designUpdateDocuments(controller);
      Project.saveProject(Project.currentProject);
    }
  }
  if (designSelectedHost) {
    const state = prefixedState(controller.state, designSelectedHost.id + '$');
    Controller.writeInputsToHost(controller, 'build$State', {object: state}); 
  }
};

const removeAtom = (controller, atomId) => {
  const targetAtom = controller.atoms[atomId];
  if (!targetAtom) {
    log.warn('removeAtom:', atomId, 'does not exist in controller');
  } else {
    Controller.removeAtom(controller, targetAtom);
  }
};

export const designUpdate = async controller => {
  const categories = getAtomTypeCategories(controller.state.build$Catalog$Filter$query);
  Controller.set(controller, 'build$Catalog$Catalog', {items: categories});
  Controller.writeInputsToHost(controller, 'build$AtomTree', {junk: Math.random()});
  Controller.writeInputsToHost(controller, 'build$AtomGraph', {layerId: designLayerId, junk: Math.random()});
  designUpdateDocuments(controller);
};

export const designUpdateDocuments = async controller => {
  if (sublayers.length) {
    let selected = controller.state.build$DesignPanels$selected;
    if (designLayerId === undefined || selected === undefined || selected === null || selected < 0 || selected >= sublayers.length) {
      selected = sublayers.length - 1;
      setDesignLayerIndex(controller, selected);
    }
    const documentPanels = {
      tabs: sublayers.map(d => d.split('$').slice(1).join('$')), 
      selected
    };
    Controller.set(controller, 'build$DesignPanels', documentPanels);
  }
};

export const designSelect = (controller, atomId) => {
  const host = controller.atoms[atomId];
  if (designSelectedHost !== host) {
    designSelectedHost = host;
    const html = !host ? '<h4 style="text-align: center; color: gray;">No selection</h4>' : `<h4 style="padding-left: .5em;">${host.id.replace(designLayerId + '$', '').replace(/\$/g, '.')}</h4>`;
    Controller.writeInputsToHost(controller, 'build$InspectorEcho', {html});
    const layerSchema = Schema.schemaForLayer(controller, designLayerId);
    const candidates = layerSchema.outputs;
    const schema = !host ? {} : Schema.deepSchemaForHost(layerSchema, host).inputs;
    const editorValue = schema.template?.value || schema.defaultShaders?.value || '';
    Controller.set(controller, 'build$CodeEditor', {id: host?.id ? host?.id + '$template' : null});
    Controller.writeInputsToHost(controller, 'build$CodeEditor', {text: editorValue});
    Controller.writeInputsToHost(controller, 'build$PropertyInspector', {id: host?.id, schema, candidates});
    Controller.writeInputsToHost(controller, 'build$ConnectionInspector', {id: host?.id, schema, candidates});
    Controller.writeInputsToHost(controller, 'build$AtomTree', {selected: host?.id});
    Controller.writeInputsToHost(controller, 'build$AtomGraph', {selected: host?.id});
    Controller.writeInputsToHost(controller, getDesignTargetId(), {selected: host?.id});
    const state = !host ? {} : prefixedState(controller.state, host.id + '$');
    Controller.writeInputsToHost(controller, 'build$State', {object: state});
  }
};

export const designDelete = (controller, atomId) => {
  // update controller state and atoms
  const host = controller.atoms[atomId];
  Controller.removeAtom(controller, host);
  // update connection in graph data
  delete host.layer.graph[host.name];
  //designUpdate(controller);
  designSelect(controller, null);
  designUpdateDocuments(controller);
  Project.saveProject(Project.currentProject);
};

const getDesignTargetId = () => {
  return designLayerId + 'Target';
};

export const designUpdateTarget = controller => {
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
      containers: atom.meta.containers
    }))
    .sort(orderCompareFactory(controller))
  ;
  result.designLayerId = layerId;
  return result;
};

const dropAtomType = async (host, eventlet, dropType) => {
  const {controller} = host.layer;
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
  const containers = dropType.containers;
  log.debug({name, container, state});
  // TODO(sjmiles): layer prefix is added back in Controller.reifyAtom, which
  // expects `container` to be in local-scope
  container = container.slice(targetLayer.length + 1);
  return addDesignedAtom(controller, layer, {name, type, container, containers, state});
};

const dropAtom = async (controller, eventlet) => {
  let container, order = 99;
  if (eventlet.before) {
    const containerHost = controller.atoms[eventlet.key];
    container = containerHost.container;
    order = getAtomStateStyle(controller, containerHost).order - 0.5;
  } else if (eventlet.after) {
    const containerHost = controller.atoms[eventlet.key];
    container = containerHost.container;
    order = getAtomStateStyle(controller, containerHost).order + 0.5;
  } else if (eventlet.key?.includes('#')) {
    container = eventlet.key;
  }
  if (container) {
    const containable = controller.atoms[eventlet.value];
    // update graph
    let [containerId, containerName] = container.split('#');
    if (!containerName) {
      containerName = containerId;
      containerId = '';
    }
    const localContainer = [containerId.split('$').slice(2).join('$'), containerName].filter(i=>i).join('#');
    containable.layer.graph[containable.name].container = localContainer;
    log.debug('localContainer', localContainer);
    // update live atom
    containable.meta.container = container;
    // update live state
    getAtomStateStyle(controller, containable).order = order;
    validateAtomOrder(controller);
    await Controller.unrender(controller);
    await Controller.rerender(controller);
    designUpdate(controller);
    Project.saveProject(Project.currentProject);
  }
};

const updateConnection = (controller, hostId, propName, connection) => {
  const propId = propName.replace(/\./g, '$');
  const target = `${hostId}$${propId}`;
  const propBits = propId.split('$');
  const propSimple = propBits.pop();
  const propHostId = [hostId, ...propBits].join('$');
  const hostSplit = hostId.split('$');
  const atomName = hostSplit.pop();
  const host = controller.atoms[hostId];
  const {graph} = host.layer;
  // may be a clearing operation (connection == null)
  if (connection) {
    // update connection in live controller
    const source = `${designLayerId}$${connection}`;
    const connections = controller.connections.inputs;
    connections[source] = [...new Set(connections[source]).add(target)];
    // update atom state
    Controller.writeInputsToHost(controller, propHostId, {[propSimple]: controller.state[source]});
  } else {
    const value = graph[host.name]?.state?.value;
    Controller.writeInputsToHost(controller, propHostId, {[propSimple]: value});
  }
  // update connection in graph data
  const atomConnections = graph[atomName].connections ??= {};
  if (connection) {
    atomConnections[propId] = [connection];
  } else {
    delete atomConnections[propId];
  }
  // forces design target to invalidate
  designUpdateTarget(controller);
  designUpdate(controller);
  Project.saveProject(Project.currentProject);
};

const updateProperty = (controller, designHostId, propId, value, nopersist) => {
  const ids = propId.split('.');
  const propName = ids.pop();
  const hostId = [designHostId, ...ids].join('$');
  // update controller state and atoms
  Controller.writeValue(controller, hostId, propName, value);
  // update graph state
  if (!nopersist) {
    Graph.updateProperty(controller, designHostId, propId, value);
    Project.saveProject(Project.currentProject);
  }
  // forces design target to invalidate
  designUpdateTarget(controller);
};

const getAtomStateStyle = (controller, atom) => controller.state[atom.id + '$style'] ??= {};
const orderCompareFactory = controller => (a, b) => Number(getAtomStateStyle(controller, a)?.order) - Number(getAtomStateStyle(controller, b)?.order);

const validateAtomOrder = async controller => {
  const atomsByContainer = {};
  Object.values(controller.atoms).forEach(atom => {
    (atomsByContainer[atom.container] ??= []).push(atom);
  });
  Object.values(atomsByContainer).forEach(atoms => {
    if (atoms.length > 1) {
      const style = a => getAtomStateStyle(controller, a);
      // for atoms that care about order
      atoms = atoms.filter(a => style(a)?.order != null);
      if (atoms.length) {
        // sort them in recorded order
        atoms.sort((a, b) => (Number(style(a).order) - Number(style(b).order)));
        // reorder them for sanity
        atoms.forEach((a, i) => style(a).order = i);
      }
    }
  });
};

const renameAtom = async (host, id, value) => {
  // calculate keys
  const {controller} = host.layer;
  const atom = controller.atoms[id];
  const newKey = [...atom.id.split('$').slice(0, -1), value].join('$');
  log.debug('layer graph rekey from', id, 'to', newKey);
  const graphAtomId = id.split('$').slice(2).join('$');
  const graphNewId = newKey.split('$').slice(2).join('$')
  // move atom from here to there
  const {layer} = atom;
  const {graph} = layer;
  graph[graphNewId] = graph[graphAtomId];
  delete graph[graphAtomId];
  log.debug('atom controller rekey from', id, 'to', newKey);
  // capture originals
  const {name: origName, id: origiId} = atom;
  // replace credentials
  atom.name = value;
  atom.id = newKey;
  // replace in controller
  delete controller.atoms[id];
  controller.atoms[newKey] = atom;
  // update controller connections
  const old = controller.connections.inputs;
  const connections = controller.connections.inputs = {};
  Object.entries(old).forEach(([name, value]) => {
    name = name.replace('$' + origName + '$', '$' + value + '$');
    value = value.map(name => name.replace('$' + origName + '$', '$' + value + '$'));
    connections[name] = value;
  });
  // update graph connections
  log.debug('connection search');
  // update connection target ids
  Object.values(layer.graph).forEach(atom => {
    if (atom.connections) {
      Object.values(atom.connections).forEach(connects => {
        connects.forEach((c$, i) => {
          if (c$.startsWith(origName + '$')) {
            connects[i] = value + '$' + c$.slice(origName.length+1);
            log.debug(c$, connects[i]);
          }
        });
      });
    }
  });
  //
  // update live state
  log.debug('state search');
  const k0 = Object.entries(controller.state).forEach(([sid, svalue]) => {
    if (sid.startsWith(id)) {
      const bits = sid.split('$');
      bits[2] = value;
      const newKey = bits.join('$');
      delete controller.state[sid];
      controller.state[newKey] = svalue;
      sid.split('$').splice(2, 1)
      log.debug('state controller rekey from', sid, 'to', newKey);
    }
  });
  //
  //update bindings
  const k1 = Object.keys(controller.connections).filter(key => key.includes(atom.id));
  log.debug(k1);
  //
  // maybe update designer's selected atom name
  designSelect(controller, null);
  // slot rename
  const slot = controller.composer.slots[id];
  controller.composer.slots[newKey] = slot;
  delete controller.composer.slots[id];
  // redundant?
  designUpdate(controller);
  // save changes
  Project.saveProject(Project.currentProject);
};