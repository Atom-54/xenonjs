/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Pcb from '../framework/Pcb.js';
import * as Graphs from './graphs.js';

export const onservice = async (host, request) => {
  const {kind, msg, data} = request;
  const service = services[kind];
  if (service) {
    const task = service[msg];
    if (task) {
      return task(host, data);
    }
  }
  log.debug('onservice: no service for', host, request);
};

const LayerService = {
  async CreateLayer(host, data) {
    const graph = Graphs[data.id];
    if (graph) {
      const {layer} = host;
      const {controller} = layer;
      const name = `${layer.name}$${host.name}`;
      const sublayer = await Pcb.reifyLayer(controller, layer.layers, name, graph, host);
      sublayer.root = layer.root || layer.name;
    }
  },
  async GetAtomInfo(host, data) {
    let {layers} = host.layer.controller;
    return getAtomInfo(layers);
  }
};

const getAtomInfo = layers => {
  const result = [];
  for (let layer of Object.values(layers)) {
    for (let [id, atom] of Object.entries(layer.atoms)) {
      result.push({
        id,
        type: atom.type.split('/').pop(),
        container: atom.container
      });
    }
    if (layer.layers) {
      result.push(...getAtomInfo(layer.layers));
    }
  }
  return result;
};

const services = {LayerService};
