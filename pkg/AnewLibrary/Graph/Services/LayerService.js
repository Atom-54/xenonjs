/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Schema from '../../Framework/Schema.js';
import * as Graphs from '../../../Anew/common/graphs.js';

export const LayerService = {
  async CreateLayer(host, data) {
    const graph = Graphs[data.id];
    if (graph) {
      const {layer} = host;
      const {controller} = layer;
      const name = `${layer.name}$${host.name}`;
      return controller.reifySublayer(layer, name, graph, host);
    }
  },
  async getAtomSchema(host) {
    return Schema.schemaForHost(host);
  }
};
