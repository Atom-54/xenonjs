/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
const log = logf('Controller', '#9F2B68');

export const create = (name, {xenon, onservice, onrender}) => {
  const controller = {
    allLayers: {},
    layers: {},
    state: {},
    atoms: {},    
    name,
    xenon,
    connections: {
      inputs: {},
      outputs: {}
    },
    // atom outflows
    onservice,
    onrender,
    onoutput: (host, output) => onoutput(controller, host, output),
    // atom inflow
    onevent: (pid, eventlet) => onevent(controller, pid, eventlet),
  };
  return controller;
};

const onoutput = (controller, host, output) => {
  //log.debug(`onoutput [${host.id}][${Object.keys(output)}]`); //[${JSON.stringify(output)}]`);
  const outputState = {};
  keys(output).map(key => outputState[`${host.layer.id}$${host.name}$${key}`] = output[key]);
  writeToState(controller, outputState);
};

// writes object to state, forwards to bindings, and notifies observer
const writeToState = (controller, inputState) => {
  const e$ = entries(inputState);
  if (e$.length) {
    //log.debug('writeToState got:', inputState);
    let filteredState;
    e$.forEach(([key, value]) => {
      if (!deepEqual(controller.state[key], value)) {
        (filteredState ??= {})[key] = value;
        bindamor(controller, key, value);
        controller.state[key] = value;
      }
    });
    //log.debug('writeToState after filter:', filteredState);
    if (filteredState) {
      controller.onwrite?.(filteredState);
    }
  }
};

const onevent = (controller, pid, eventlet) => {
  controller.atoms[pid]?.handleEvent(eventlet);
};

export const reifySublayer = async (controller, layer, id, graph, host) => {
  return reifyLayer(controller, layer.layers, id, graph, host);
};

export const findLayer = (controller, layerId) => {
  let layer;
  let owner = controller;
  while (!layer && layerId && owner) {
    layer = owner.layers[layerId];
    if (!layer && layerId) {
      const nextLayerId = Object.keys(owner.layers).find(key => layerId.startsWith(key + '$'));
      owner = owner.layers[nextLayerId];
    }
  }
  return layer;
};

export const reifyLayer = async (controller, layers, id, graph, host) => {
  const layer = createLayer(id, controller);
  layers[id] = layer;
  controller.allLayers[id] = layer;
  layer.host = host;
  layer.graph = graph;
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
    if (name !== 'meta') {
      let {type, container, containers, state, connections} = value;
      // insist on order values for the renderer
      if (!state?.style || !('order' in state?.style)) {
        state ??= {};
        // avoid ??= in case 'style' has been erroneously set to a string
        state.style = (state.style && typeof state.style === 'object') ? state.style : {};
        state.style.order = i;
      }
      await reifyAtom(controller, layer, {name, type, container, containers, state, connections});
    }
  }
};

export const reifyAtom = async (controller, layer, {name, type, containers, container, state, connections}) => {
  // create atom
  const host = await addAtom(controller, layer, {name, type, container, containers});
  if (host) {
    // process connection information
    if (connections) {
      const inputConnections = controller.connections.inputs;
      for (let [key, targets] of Object.entries(connections)) {
        if (!Array.isArray(targets)) {
          targets = [targets];
        }
        for (const connection of targets) {
          const source = `${layer.id}$${connection}`;
          const targetName = `${layer.id}$${host.name}`;
          const target = `${targetName}$${key}`;
          (inputConnections[source] ??= []).push(target);
          if (source in controller.state) {
            (state ??= {})[key] = controller.state[source];
          }
        }
      }
    }
    // process state information
    if (state) {
      const qualifiedState = {};
      for (const [key, value] of Object.entries(state)) {
        const qualifiedKey = `${layer.id}$${host.name}$${key}`;
        // use existing state first, then default to atom state
        qualifiedState[qualifiedKey] = (qualifiedKey in controller.state) ? controller.state[qualifiedKey] : value;
      }
      writeToState(controller, qualifiedState);
    }
    // locate existing state for host
    const hostState = {};
    for (const [key, value] of Object.entries(controller.state)) {
      const keyBits = key.split('$');
      const propName = keyBits.pop();
      const keyHost = keyBits.join('$');
      if (keyHost === host.id) {
        hostState[propName] = value;
      }
    }
    host.inputs = hostState;
  }
  return host;
};

export const addAtom = async (controller, layer, {name, type, container, containers}) => {
  const atom = await createAtom(controller, layer, {name, type, container, containers});
  if (atom) {
    atom.listen('service', request => controller.onservice?.(atom, request));
    atom.listen('output', output => controller.onoutput?.(atom, output));
    atom.listen('render', packet => controller.onrender?.(atom, packet));
    controller.atoms[atom.id] = atom;
  }
  return atom;
};

export const removeAtom = async (controller, atom) => {
  atom.dispose();
  delete controller.atoms[atom.id];
  return atom;
};

export const createAtom = async (controller, layer, {name, type, container, containers}) => {
  const id = `${layer.id}$${name}`;
  const host = await controller.xenon.emitter(name, {type});
  if (host) {
    host.id = id;
    host.type = type;
    host.layer = layer;
    host.meta = {
      name,
      type,
      container: calculateContainer(host, container),
      containers
    };
  }
  return host;
};

const calculateContainer = (host, localContainer) => {
  const {layer} = host;
  // if top-layer and no localContainer, we default to 'root'
  if (!layer.host && !localContainer) {
    return 'root';
  } 
  // could be empty
  if (!localContainer) {
    localContainer ??= '#Container';
  } 
  // could be 'thing$thing#Container' or 'thing#Container'
  else if (localContainer.includes('$') || localContainer.indexOf('#') > 0) {
    localContainer = '$' + localContainer;
  } 
  // could be 'Container'
  else if (localContainer[0] !== '#') {
    localContainer = '#' + localContainer;
  }
  // otherwise it's '#Container'
  const container = layer.id + localContainer;
  return container;
};

// write name, value pair to hosts and state, forward to bindings
export const writeValue = (controller, atomId, propName, value) => {
  set(controller, atomId, {[propName]: value});
  bindamor(controller, `${atomId}$${propName}`, value);
};

// forward value to bindings
const bindamor = (controller, key, value) => {
  // input connections of `key`
  const bound = controller.connections?.inputs?.[key];
  // for each bound connection
  bound?.forEach(connection => {
    // binding channel is active
    //log.debug(`[${connection}] receives data from [${key}]`); // the value`, String(value).slice(0, 30));
    // conver data to local format
    const bits = connection.split('$');
    const prop = bits.pop();
    const atomId = bits.join('$');
    // set data 
    set(controller, atomId, {[prop]: value});
  });
};

// keys in `inputs` are local to main `key`
export const set = (controller, key, inputs) => {
  writeInputsToState(controller, key, inputs);
  writeInputsToHost(controller, key, inputs);
};

// keys in `inputs` are local to main `key`
const writeInputsToState = (controller, key, inputs) => {
  for (let [prop, value] of Object.entries(inputs)) {
    controller.state[key + '$' + prop] = value;
  }
};

// keys in `inputs` are local to main `key`
export const writeInputsToHost = (controller, key, inputs) => {
  const atom = controller.atoms[key];
  if (atom) {
    atom.inputs = inputs;
  } else {
    log('bound atom [', key, '] does not exist')
  }
};

export const unrender = async controller => {
  await Promise.all(values(controller.atoms).map(atom => atom.render({$clear: true})));
};

export const rerender = async controller => {
  await Promise.all(values(controller.atoms).map(atom => atom.rerender()));
};
