/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
//import {makeCapName} from '../../CoreXenon/Reactor/Atomic/js/names.js';
import * as Library from '../../Xenon/Library.js';
import * as Controller from '../../Framework/Controller.js';
import * as Documents from '../../Documents/Services/DocumentService.js';
import * as Schema from '../Schema.js';
import * as Graph from '../Graph.js';

const log = logf('DesignService', '#512E5F', 'white');

export let designLayerId, designSelectedHost;
export const sublayers = [];

// const DesignTarget = {
//   type: '$library/Design/Atoms/DesignTarget',
//   container: 'DesignPanels#Container'
// };

// const Sublayer = {
//   type: '$library/Graph/Atoms/Graph',
//   container: 'DesignTarget#Container',
//   state: {
//     style: {
//       overflow: 'auto'
//     }
//   }
// };

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
  // async SetDesignLayerIndex(host, {index}) {
  //   setDesignLayerIndex(host.layer.controller, index);
  //   //return designUpdate(host.layer.controller);
  // },
  // async NewGraph(host) {
  //   return newGraph(host.layer);
  // },
  Select(host, {atomId}) {
    designSelect(host.layer.controller, atomId);
  },
  Delete(host, {atomId}) {
    designDelete(host.layer.controller, atomId);
  },
  async UpdateDesigner(host) {
    //return designUpdate(host.layer.controller);
  },
  GetAtomTypeCategories() {
    return getAtomTypeCategories();
  },
  async GetAtomTree(host, data) {
    designLayerId ||= host.id.split('$').slice(0, 2).join('$') + '$Graph';
    return getAtomTree(host.layer.controller, designLayerId, data);
  },
  async GetAtomGraphInfo(host, {layerId}) {
    layerId ||= host.id.split('$').slice(0, 2).join('$') + '$Graph';
    const layer = Controller.findLayer(host.layer.controller, layerId);
    return layer ? getGraphMetaData(layer.graph, 'atomGraphInfo') : {};
  },
  async SetAtomGraphInfo(host, {layerId, info}) {
    layerId ||= host.id.split('$').slice(0, 2).join('$') + '$Graph';
    const controller = host.layer.controller;
    const layer = Controller.findLayer(controller, layerId);
    return setGraphMetaData(layer, layer.graph, 'atomGraphInfo', info);
  },
  async GetLayerInfo(host, {layerId}) {
    layerId ||= host.id.split('$').slice(0, 2).join('$') + '$Graph';
    const {controller} = host.layer;
    const schema = Schema.schemaForLayer(controller, layerId);
    const atoms = getAtomInfo(controller, layerId);
    const connections = controller.connections;
    return {atoms, schema, connections};
  },
  async GetHostSchema(host, {key}) {
    if (key) {
      const layerId = host.id.split('$').slice(0, 2).join('$') + '$Graph';
      const layerSchema = Schema.schemaForLayer(host.layer.controller, layerId);
      const schema = Schema.deepSchemaForHost(layerSchema, key).inputs;
      const candidates = layerSchema.outputs;
      return {schema, candidates};
    }
    return {};
  },
  async DesignDragDrop(host, {eventlet}) {
    const types = getAtomTypes();
    const dropType = types.find(({name}) => name === eventlet.value);
    if (dropType) {
      log.debug('Dropping type', eventlet, dropType);
      await dropAtomType(host, eventlet, dropType);
    } else {
      log.debug('Dropping atom', eventlet);
      await dropAtom(host, eventlet);
    }
  },
  ConnectionChange(host, {id, key, value}) {
    //designLayerId = id?.split('$').slice(0, -1).join('$');
    updateConnection(host.layer.controller, id, key, value);
  },
  PropertyChange(host, {id, key, value, nopersist}) {
    //designLayerId = id?.split('$').slice(0, -1).join('$');
    if (key === 'name') {
      renameAtom(host, id, value)
    } else {
      updateProperty(host.layer.controller, id, key, value, nopersist);
    }
  },
  async ObserveCatalog(host) {
    (DesignService.catalogObservers ??= []).push(host.id);
    DesignService.catalog ??= await initCatalogData(host.layer.controller);
    return DesignService.catalog;
  }
};

const initCatalogData = async controller => {
  return getAtomTypeCategories(controller.state.run$PartsGraph$Catalog$Filter$query);
};

// const notifyCatalogObservers = (controller, catalog) => {
//   DesignService.catalog = catalog;
//   DesignService.catalogObservers.forEach(id => {
//     controller.onevent(id, {handler: 'onObservation', data: catalog});
//   });
// };

// export const newGraph = async layer => {
//   const name = makeCapName();
//   await reifyGraph(layer, name);
//   //Controller.writeInputsToHost(layer.controller, 'build$DesignPanels', {selected: sublayers.length-1});
// };

// export const loadGraph = async (layer, name) => {
//   await reifyGraph(layer, name);
//   validateAtomOrder(layer.controller);
//   //Controller.writeValue(layer.controller, 'build$DesignPanels', 'selected', sublayers.length-1);
// };

// export const reifyGraph = async (layer, name) => {
//   const sublayer = await createSublayer(layer, name);
//   log.debug('reifyGraph: created sublayer', name, sublayer);
//   Controller.writeInputsToHost(layer.controller, sublayer.id, {graphId: name});
//   designSelect(layer.controller, null);
//   return sublayer;
// };

export const getGraphMetaData = (graph, property) => {
  return graph.meta[property];
};

export const setGraphMetaData = async (layer, graph, property, value) => {
  graph.meta[property] = value;
  saveDesignGraph(layer);
};

// const createSublayer = async (layer, name) => {
//   const {controller} = layer;
//   controller.onwrite = designObserver.bind(this, controller);
//   const sublayerName = name;
//   const targetName = name + 'Target'
//   const targetContainer = 'DesignPanels#Container';
//   const state = {style: {order: sublayers.length}};
//   delete controller.state['build$' + targetName + '$style'];
//   /*const target =*/ await Controller.reifyAtom(controller, layer, {...DesignTarget, name: targetName, container: targetContainer, state});
//   const sublayerContainer = targetName + '#Container';
//   const sublayer = await Controller.reifyAtom(controller, layer, {...Sublayer, name: sublayerName, container: sublayerContainer});
//   sublayers.push(layer.name + '$' + sublayerName);
//   return sublayer;
// };

// const setDesignLayerIndex = async (controller, index) => {
//   const layerId = sublayers[index];
//   if (layerId) {
//     designLayerId = layerId;
//     designSelect(controller, '');
//   }
// };

// export const getDesignLayer = controller => {
//   return Controller.findLayer(controller, designLayerId);
// };

export const saveDesignGraph = layer => {
  // const layer = getDesignLayer(controller);
  const graph = layer?.graph;
  if (graph && graph.meta.path) {
    return Documents.putDocument({layer}, graph.meta.path, graph);
  } else {
    log.debug('saveDesignGraph: graph has no `meta.path`', graph);
  }
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

// const designObserver = (controller, inputs) => {
//   const text = inputs.build$CodeEditor$text;
//   const qualifiedId = controller.state.build$CodeEditor$id;
//   if (text && qualifiedId) {
//     if (text !== controller.state[qualifiedId]) {
//       const parts = qualifiedId.split('$');
//       const key = parts.pop();
//       const id = parts.join('$');
//       log.debug('designObserver: updating property text for', id, key);
//       updateProperty(controller, id, key, text);
//     }
//   }
//   if ('build$PartsGraph$Catalog$Filter$query' in inputs) {
//     //designUpdate(controller);
//   }
//   if ('build$DesignPanels$tabs' in inputs) {
//     const tabs = inputs.build$DesignPanels$tabs;
//     if (tabs.length < sublayers.length) {
//       for (let i=0; i<sublayers.length; i++) {
//         const suffix = tabs[i];
//         if (!sublayers[i].endsWith(suffix)) {
//           const sublayerId = sublayers[i];
//           log.debug('remove layer #', i, sublayerId);
//           sublayers.splice(i--, 1);
//           removeAtom(controller, sublayerId);
//           removeAtom(controller, sublayerId + 'Target');
//         }
//       }
//       designUpdateDocuments(controller);
//     }
//   }
//   if (designSelectedHost) {
//     const state = prefixedState(controller.state, designSelectedHost.id + '$');
//     Controller.writeInputsToHost(controller, 'build$State', {object: state}); 
//   }
// };

// const removeAtom = (controller, atomId) => {
//   const targetAtom = controller.atoms[atomId];
//   if (!targetAtom) {
//     log.warn('removeAtom:', atomId, 'does not exist in controller');
//   } else {
//     Controller.removeAtom(controller, targetAtom);
//   }
// };

/*export const designUpdate = async controller => {
  // const categories = getAtomTypeCategories(controller.state.build$PartsGraph$Catalog$Filter$query);
  // Controller.set(controller, 'run$PartsGraph$Catalog$Catalog', {items: categories});
  // Controller.writeInputsToHost(controller, 'build$AtomTree', {junk: Math.random()});
  // Controller.writeInputsToHost(controller, 'build$EditorsGraph$AtomGraph', {layerId: designLayerId, junk: Math.random()});
  // designUpdateDocuments(controller);
};
*/

/*export const designUpdateDocuments = async controller => {
  // if (sublayers.length) {
  //   let selected = controller.state.build$DesignPanels$selected;
  //   if (designLayerId === undefined || selected === undefined || selected === null || selected < 0 || selected >= sublayers.length) {
  //     selected = sublayers.length - 1;
  //     setDesignLayerIndex(controller, selected);
  //   }
  //   const documentPanels = {
  //     tabs: sublayers.map(d => d.split('$').slice(1).join('$')), 
  //     selected
  //   };
  //   Controller.set(controller, 'build$DesignPanels', documentPanels);
  // }
};
*/

export const designSelect = (controller, atomId) => {
  const bits = atomId?.split('$') || [];
  const selection = atomId ? [...bits.slice(0, -2), 'Selected'].join('$') : null;
  Controller.set(controller, selection, {value: atomId});
};

export const designDelete = (controller, atomId) => {
  // update controller state and atoms
  const host = controller.atoms[atomId];
  Controller.removeAtom(controller, host);
  // update connection in graph data
  delete host.layer.graph[host.name];
  //designUpdate(controller);
  designSelect(controller, null);
  //designUpdateDocuments(controller);
  saveDesignGraph(host.layer);
  //Project.saveProject(Project.currentProject);
};

// const getDesignTargetId = () => {
//   return designLayerId + 'Target';
// };

// export const designUpdateTarget = controller => {
//   Controller.writeInputsToHost(controller, getDesignTargetId(), {refresh: Math.random()});
// };

// const prefixedState = (state, prefix)=> {
//   const prefixedState = {};
//   entries(state).forEach(([id, value]) => {
//     if (id.startsWith(prefix)) {
//       prefixedState[id.slice(prefix.length).replace(/\$/g, '.')] = value;
//     }
//   });
//   return prefixedState;
// };

const getAtomInfo = (controller, layerId) => {
  const result = Object.entries(controller.atoms)
    .filter(([id]) => id.startsWith(layerId + '$'))
    .map(([id, atom]) => ({
      id,
      ...getTypeInfo(atom),
      container: atom.meta?.container,
      containers: atom.meta?.containers
    }))
    .sort(orderCompareFactory(controller))
  ;
  result.designLayerId = layerId;
  return result;
};

const getTypeInfo = atom => {
  const type = atom.type.split('/').pop().toLowerCase();
  if (type.includes('field')) {
    return {type, icon: 'match_word', color: 'green'};
  }
  return {type, icon: 'build'};
};

const dropAtomType = async (host, eventlet, dropType) => {
  const {controller} = host.layer;
  const key = eventlet.key.replace(/_/g, '$');
  let container = key.includes('#') && key;
  if (!container) {
    const targetHost = controller.atoms[key];
    container = targetHost.container;
  }
  const designLayer = host.layer;
  const layer = designLayer.layers[designLayer.id + '$Graph'];
  //const targetLayer = designLayerId;
  //const layer = Controller.findLayer(controller, targetLayer);
  const name = dropType.name + Math.floor(Math.random()*100);
  const type = dropType.type; 
  const state = dropType.state || {};
  const containers = dropType.containers;
  log.debug({name, container, state});
  // TODO(sjmiles): layer prefix is added back in Controller.reifyAtom, which
  // expects `container` to be in local-scope
  container = container.slice(layer.id.length + 1);
  return addDesignedAtom(controller, layer, {name, type, container, containers, state});
};

export const addDesignedAtom = async (controller, layer, {name, type, container, containers, state}) => {
  layer.graph[name] = {type, container, containers, state}; 
  const host = await Controller.reifyAtom(controller, layer, {name, type, container, containers, state});
  designSelect(controller, host.id);
  saveDesignGraph(layer);
};

const dropAtom = async (host, eventlet) => {
  const {controller} = host.layer;
  let container, order = 99;
  //
  let parentKey = eventlet.key || '';
  if (parentKey.includes('#')) {
    container = parentKey;
    parentKey = parentKey.split('#')[0];
  }
  const containerHost = controller.atoms[parentKey];
  container ??= containerHost.container;
  //
  order = getAtomStateStyle(controller, containerHost).order;
  if (eventlet.before) {
    order -= 0.5;
  } else if (eventlet.after) {
    order += 0.5;
  }
  //
  if (container) {
    const containable = controller.atoms[eventlet.value];
    // update graph
    let [containerId, containerName] = container.split('#');
    if (!containerName) {
      containerName = containerId;
      containerId = '';
    }
    const localContainer = [containerId.split('$').slice(3).join('$'), containerName].filter(i=>i).join('#');
    containable.layer.graph[containable.name].container = localContainer;
    log.debug('localContainer', localContainer);
    // update live atom
    containable.meta.container = container;
    // update live state
    getAtomStateStyle(controller, containable).order = order;
    validateAtomOrder(controller);
    await Controller.unrender(controller);
    await Controller.rerender(controller);
    //designUpdate(controller);
    saveDesignGraph(containable.layer);
    //Project.saveProject(Project.currentProject);
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
  // delete previous connection values
  const connections = controller.connections.inputs;
  clearConnections(connections, target);
  // may be a clearing operation (connection == null)
  if (connection) {
    // update connection in live controller
    const source = `${designLayerId}$${connection}`;
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
  //designUpdateTarget(controller);
  //designUpdate(controller);
  // Project.saveProject(Project.currentProject);
  //const layer = Controller.findLayer(controller, designLayerId);
  saveDesignGraph(host.layer);
};

const clearConnections = (connections, target) => {
  Object.entries(connections).forEach(([source, targets]) => {
    const index = targets.indexOf(target);
    if (index >= 0) {
      targets.splice(index, 1);
      if (!targets.length) {
        delete connections[source];
      }
    }
  });
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
    //const designLayerId = designHostId.split('$').slice(0, -1).join('$');
    //const layer = Controller.findLayer(controller, designLayerId);
    saveDesignGraph(controller.atoms[hostId].layer);
    //Project.saveProject(Project.currentProject);
  }
  // forces design target to invalidate
  //designUpdateTarget(controller);
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
  // tree root controller
  const {controller} = host.layer;
  // atom to rename
  const atom = controller.atoms[id];
  // calculate keys
  const newKey = [...atom.id.split('$').slice(0, -1), value].join('$');
  const graphAtomId = id.split('$').slice(3).join('$');
  const graphNewId = newKey.split('$').slice(3).join('$')
  // move atom from here to there in graph
  const {layer} = atom;
  const {graph} = layer;
  graph[graphNewId] = graph[graphAtomId];
  delete graph[graphAtomId];
  log.debug('layer graph rekeyed from', graphAtomId, 'to', graphNewId);
  //
  // capture original credentials
  const {name: origName, id: origiId} = atom;
  // replace credentials
  atom.name = value;
  atom.id = newKey;
  //
  // replace reference in controller
  delete controller.atoms[id];
  controller.atoms[newKey] = atom;
  log.debug('atom controller rekey from', id, 'to', newKey);
  //
  // update controller connections
  const old = controller.connections.inputs;
  const newInputs = JSON.parse(JSON.stringify(old).replaceAll(id, newKey));
  // const connections = controller.connections.inputs = {};
  // Object.entries(old).forEach(([name, value]) => {
  //   name = name.replace('$' + origName + '$', '$' + value + '$');
  //   value = value.map(name => name.replace('$' + origName + '$', '$' + value + '$'));
  //   connections[name] = value;
  // });
  controller.connections.inputs = newInputs;
  //
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
  //update connections
  // const k1 = Object.keys(controller.connections.inputs); //.filter(key => key.includes(atom.id));
  log.debug('connections', controller.connections.inputs);
  //
  // slot rename
  controller.composer.slots[atom.id] = controller.composer.slots[id];
  delete controller.composer.slots[id];
  //
  // maybe update designer's selected atom name
  designSelect(controller, null);
  // redundant?
  //designUpdate(controller);
  //
  // save changes
  saveDesignGraph(layer);
  //Project.saveProject(Project.currentProject);
};

const getAtomTree = (controller, designLayerId, selected) => {
  const atoms = getAtomInfo(controller, designLayerId);
  atoms.forEach(atom => atom.name = atom.id.replace(designLayerId + '$', '').replace(/\$/g, '.'));
  const rootAtoms = atomsInContainer(atoms, designLayerId + '#Container')
  const root = {
    name: 'root',
    entries: rootAtoms,
    hasEntries: true,
    opened: true
    //disabled: true
  };
  stratify(atoms, root, selected);
  return [root];
};

const atomsInContainer = (allAtoms, containerName) => {
  const atoms = allAtoms
    .filter(({container}) => container === containerName)
    .map(atom => ({
      ...atom, 
      hasEntries: atom.containers?.length,
      opened: true
    }))
    ;
  return atoms;
};

const stratify = (allAtoms, root, selected) => {
  const _stratify = containerNode => {
    containerNode.entries.forEach(atom => {
      atom.selected = atom.id === selected;
      if (!atom.type.endsWith('Graph')) {
        const atoms = atomsInParent(allAtoms, atom.id)
        const foundContainers = new Set([
          ...atom.containers || [],
          ...atoms.map(({container}) => container.split('#').pop().replace(allAtoms.designLayerId, '')) || []
        ]);
        const containers = [...foundContainers];
        atom.containers = containers.map(name => {
          const contained = atomsInContainer(atoms, `${atom.id}#${name}`);
          const container = {
            name, 
            id: atom.id + '#' + name, 
            entries: contained,
            hasEntries: contained?.length,
            opened: true
          };
          _stratify(container);
          return container;
        });
      }
    });
  };
  return _stratify(root);
};

const atomsInParent = (allAtoms, parentName) => {
  return allAtoms.filter(({container}) => container?.split('#').shift() === parentName);
};