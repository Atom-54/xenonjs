/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
const log = logf('Simple', '#BF40BF');

export const create = (name, controller) => {
  const atoms = {};
  const hostEventHandler = {
    service: (host, request) => controller?.onservice?.(host, request),
    output: (host, output) => controller?.onoutput?.(host, output),
    render: (host, packet) => controller?.onrender?.(host, packet)
  };
  const uxEventHandler = (pid, eventlet) => atoms[pid].handleEvent(eventlet);
  const layer = {
    name,
    xenon: controller.xenon,
    controller,
    hostEventHandler,
    uxEventHandler,
    atoms,
    layers: {}
  };
  return layer;
};

export const addAtom = async (layer, {name, type, container}) => {
  const id = `${layer.name}$${name}`;
  const host = layer.atoms[id] = await layer.xenon.emitter(name, {type});
  host.id = id;
  host.type = type;
  host.layer = layer;
  host.meta = {
    name,
    type,
    container: container || findContainer(host)
  };
  host.listen('service', request => atomService(layer.hostEventHandler?.service, host, request));
  host.listen('output', output => layer.hostEventHandler?.output?.(host, output));
  host.listen('render', packet => layer.hostEventHandler?.render?.(host, packet));
  return host;
};

const atomService = async (serviceHandler, host, request) => { 
  const value = await serviceHandler?.(host, request)
  if (request.resolve) {
    request.resolve(value);
  }
  return value;
};

const findContainer = host => {
  let h = host;
  while (h && h.container === 'root') h = h.layer.host;
  return h?.container || host.container;
};

export const reify = async (layer, graph) => {
  for (let [name, value] of entries(graph)) {
    const {type, state, container} = value;
    const host = await addAtom(layer, {name, type, container});
    host.inputs = state || {};
  }
};

