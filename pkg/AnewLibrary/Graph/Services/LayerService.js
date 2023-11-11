/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from '../../Framework/Controller.js';
import * as Project from '../../Design/Services/ProjectService.js';
import * as Design from '../../Design/Services/DesignService.js';

import {Graphs} from '../../../Anew/graphs.js';

export const LayerService = {
  async CreateLayer(host, data) {
    const graph = Graphs[data.id] || Project.getGraph(data.id);
    if (graph) {
      const {layer} = host;
      const {controller} = layer;
      const name = `${layer.name}$${host.name}`;
      await Controller.reifySublayer(controller, layer, name, graph, host);
      // TODO(sjmiles): Design may not exist, we need to do this another way
      Design.designUpdate(controller);
    }
  }
};
