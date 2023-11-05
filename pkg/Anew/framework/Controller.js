/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
const log = logf('Controller', '#9F2B68');

export const create = (name, bindings, {xenon, onservice, onrender}) => {
  const controller = {
    layers: {},
    state: {},
    atoms: {},    
    name,
    xenon,
    bindings,
    onservice,
    onrender,
    onoutput: (host, output) => {
      const outputState = {};
      keys(output).map(key => outputState[`${host.layer.id}$${host.name}$${key}`] = output[key]);
      write(controller, outputState);
    },
    uxEventHandler: (pid, eventlet) => {
      controller.atoms[pid].handleEvent(eventlet);
    },
    reifySublayer: async (layer, id, graph, host) => {
      return reifyLayer(controller, layer.layers, id, graph, host);
    }
  };
  return controller;
};

export const reifyLayer = async (controller, layers, id, graph, host) => {
  const layer = createLayer(id, controller);
  layers[id] = layer;
  layer.host = host;
  await reifyAtoms(controller, layer, graph);
  return layer;
};

export const createLayer = (id, controller) => {
  const layer = {
    id,
    name: id, // deprecated
    atoms: {},
    layers: {},
    controller
  };
  return layer;
};

export const reifyAtoms = async (controller, layer, graph) => {
  for (let [name, value] of entries(graph)) {
    const {type, state, container} = value;
    const host = await addAtom(controller, layer, {name, type, container});
    if (state) {
      const qualifiedState = {};
      for (let [key, value] of Object.entries(state)) {
        qualifiedState[`${layer.id}$${host.name}$${key}`] = value;
      }
      write(controller, qualifiedState);
    }
    host.inputs = state || {};
  }
};

export const addAtom = async (controller, layer, {name, type, container}) => {
  const atom = await createAtom(controller, layer, {name, type, container});
  atom.listen('service', request => controller.onservice?.(atom, request));
  atom.listen('output', output => controller.onoutput?.(atom, output));
  atom.listen('render', packet => controller.onrender?.(atom, packet));
  controller.atoms[atom.id] = atom;
  return atom;
};

export const createAtom = async (controller, layer, {name, type, container}) => {
  const id = `${layer.id}$${name}`;
  const host = await controller.xenon.emitter(name, {type});
  host.id = id;
  host.type = type;
  host.layer = layer;
  host.meta = {
    name,
    type,
    container: calculateContainer(host, container)
  };
  return host;
};

const calculateContainer = (host, localContainer) => {
  const {layer} = host;
  // if top-layer and no localContainer, we default to 'root'
  if (!layer.host && !localContainer) {
    return 'root';
  } 
  // cotainer is layerRoot with localContainer or `#Container`
  const container = layer.id + (localContainer ? '$' + localContainer : '#Container');
  return container;
};

const write = (controller, inputState) => {
  entries(inputState).forEach(([key, value]) => {
    bindamor(controller, key, value);
    controller.state[key] = value;
  })
};

const bindamor = (controller, key, value) => {
  const bound = controller.bindings?.inputs?.[key];
  if (bound) {
    log.debug(`[${bound}] receives from [${key}] the value`, value);
  }
};

export const setInputs = (controller, key, inputs) => {
  controller.atoms[key].inputs = inputs;
};
