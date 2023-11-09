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

export const findLayer = (controller, layerId) => {
  let layer;
  let owner = controller;
  while (!layer && owner) {
    layer = owner.layers[layerId];
    if (!layer) {
      const nextLayerId = Object.keys(owner.layers).find(key => layerId.startsWith(key + '$'));
      owner = owner.layers[nextLayerId];
    }
  }
  return layer;
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
    layers: {},
    controller
  };
  return layer;
};

export const reifyAtoms = async (controller, layer, graph) => {
  const entries = Object.entries(graph);
  for (let i=0, entry; entry=entries[i]; i++) {
    const [name, value] = entry;
    let {type, state, container} = value;
    ((state ??= {}).style ??= {}).order ??= i;
    await reifyAtom(controller, layer, {name, type, container, state});
  }
};

export const reifyAtom = async (controller, layer, {name, type, container, state}) => {
  const host = await addAtom(controller, layer, {name, type, container});
  if (state) {
    const qualifiedState = {};
    for (let [key, value] of Object.entries(state)) {
      qualifiedState[`${layer.id}$${host.name}$${key}`] = value;
    }
    write(controller, qualifiedState);
  }
  host.inputs = state || {};
  return host;
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
    const bits = bound.split('$');
    const prop = bits.pop();
    const atomId = bits.join('$');
    set(controller, atomId, {[prop]: value});
  }
};

export const set = (controller, key, inputs) => {
  writeInputsToState(controller, key, inputs);
  writeInputsToHost(controller, key, inputs);
};

export const writeInputsToState = (controller, key, inputs) => {
  for (let [prop, value] of Object.entries(inputs)) {
    controller.state[key + '$' + prop] = value;
  }
  //Object.assign(controller.state[key], inputs);
};

export const writeInputsToHost = (controller, key, inputs) => {
  const atom = controller.atoms[key];
  if (atom) {
    atom.inputs = inputs;
  } else {
    log.warn('bound atom [', key, '] does not exist')
  }
};
