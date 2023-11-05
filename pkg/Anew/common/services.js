/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Graphs from './graphs.js';

export const onservice = async (host, request) => {
  const {kind, msg, data, resolve} = request;
  const service = services[kind];
  if (service) {
    const task = service[msg];
    if (task) {
      const value = await task(host, data);
      resolve(value);
    }
  } else {
    log.debug('onservice: no service for', host, request);
  }
};

const LayerService = {
  async CreateLayer(host, data) {
    const graph = Graphs[data.id];
    if (graph) {
      const {layer} = host;
      const {controller} = layer;
      const name = `${layer.name}$${host.name}`;
      return controller.reifySublayer(layer, name, graph, host);
    }
  },
  async GetAtomInfo(host, data) {
    return getAtomInfo(host.layer.controller);
  }
};

const getAtomInfo = controller => {
  const result = Object.entries(controller.atoms).map(([id, atom]) => ({
    id,
    type: atom.type.split('/').pop(),
    container: atom.container
  }));
  return result;
};

const services = {LayerService};
