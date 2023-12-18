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
  writeToState(controller, outputState, true);
};

export const onevent = (controller, pid, eventlet) => {
  controller.atoms[pid]?.handleEvent(eventlet);
};

// writes object to state, forwards to bindings, and notifies observer
const writeToState = (controller, inputState, filtering) => {
  const e$ = entries(inputState);
  if (e$.length) {
    //log.debug('writeToState got:', inputState);
    let filteredState;
    e$.forEach(([key, value]) => {
      if (!filtering || !deepEqual(controller.state[key], value)) {
        (filteredState ??= {})[key] = value;
        controller.state[key] = value;
        bindamor(controller, key, value);
      }
    });
    //log.debug('writeToState processed these:', filteredState);
    if (filteredState) {
      controller.onwrite?.(filteredState);
    }
    return filteredState;
  }
};

// writes fully qualified data to host(s)
const writeToHost = (controller, state) => {
  for (const [propId, value] of Object.entries(state)) {
    const parts = propId.split('$');
    const name = parts.pop();
    const atomId = parts.join('$');
    const host = controller.atoms[atomId];
    if (host) {
      host.inputs = {[name]: value};
    }
    //log.debug(host.id, name, value);
  }
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
    // remap static state into live state format
    const qualifiedState = {};
    for (const [key, value] of Object.entries(state || {})) {
      const qualifiedKey = `${layer.id}$${host.name}$${key}`;
      qualifiedState[qualifiedKey] = value;
    }
    // bindings are inverted from connections; bindings = [source] => [...targets]
    // bindings are fully qualified
    const bindings = controller.connections.inputs;
    // install connections from host into controller.connections (bindings)
    if (connections) {
      // connections are [target] => [...sources]
      // connections are locally qualified
      // ["records", ["Thing$Bar$value"]]
      for (let [property, sources] of Object.entries(connections)) {
        sources = Array.isArray(sources) ? sources : [sources];
        // painstakingly update binding records for inverted connection records
        // e.g. "NibGraph$Bar$value" of ["NibGraph$Bar$value"]
        for (const source of sources) {
          // build$ThingGraph$NibGraph$Bar$value
          const sourceId = [layer.id, source].join('$');
          //const connects = bindings[sourceId] || [];
          // build$ThingGraph$Fibler$records
          const targetId = [layer.id, name, property].join('$');
          // update bindings to match connection target
          updateBindings(bindings, sourceId, targetId);
        }
      }
    }
    const prefixId = host.id + '$';
    // data currently in live state has 'missed' the atom
    for (const key of Object.keys(controller.state)) {
      if (key.startsWith(prefixId)) {
        qualifiedState[key] = controller.state[key];
      }
    }
    // data currently in live state has 'missed' new connections, 
    // recreate missed connection effects
    for (const [sourceId, list] of Object.entries(bindings)) {
      for (const targetId of list) {
        if (targetId.startsWith(prefixId)) {
          if (sourceId in controller.state) {
            qualifiedState[targetId] = controller.state[sourceId];
          }
          //log.debug(targetId, host.id, qualifiedState[targetId], controller.state[sourceId]);
        }
      }
    }
    // pump live state data into reactor
    writeToState(controller, qualifiedState);
    writeToHost(controller, qualifiedState);
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
  if (!layer.host && (!localContainer || localContainer === 'Container')) {
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

const updateBindings = (bindings, sourceId, targetId) => {
  // prefer existing binding 
  // for (const [key, targets] of Object.entries(bindings)) {
  //   if (targets.includes(targetId)) {
  //     log.debug('preserve newer binding', key, bindings, targetId);
  //     return;
  //   }
  // }
  // set new binding
  (bindings[sourceId] ??= []).push(targetId);
  //log.debug('add to binding', sourceId, targetId);
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
    log(`[${connection}] receives data from [${key}]`); // the value`, String(value).slice(0, 30));
    // convert data to local format
    const bits = connection.split('$');
    const prop = bits.pop();
    const atomId = bits.join('$');
    // set data 
    set(controller, atomId, {[prop]: value});
  });
};

// keys in `inputs` are local to main `key`
export const set = (controller, key, inputs) => {
  writeInputsToHost(controller, key, inputs);
  writeInputsToState(controller, key, inputs);
};

// keys in `inputs` are local to main `key`
const writeInputsToState = (controller, key, inputs) => {
  const state = {};
  for (let [prop, value] of Object.entries(inputs)) {
    state[key + '$' + prop] = value;
  }
  writeToState(controller, state, true);
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
