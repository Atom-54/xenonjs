/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from '../../Framework/Controller.js';
import * as Project from '../../Design/Services/ProjectService.js';
import * as Design from '../../Design/Services/DesignService.js';
import * as Document from '../../Documents/Services/DocumentService.js';

const Graphs = globalThis.Graphs || {};

export const LayerService = {
  async CreateLayer(host, data) {
    // locating graph data is non-trivial
    const graph = data?.id && await getGraphContent(data.id);
    if (graph) {
      const name = `${host.layer.name}$${host.name}`;
      await createLayer(host, name, graph);
      // TODO(sjmiles): Design may not exist, we need to do this another way
      Design.designUpdate(host.layer.controller);
    }
  },
  async ObserveState(host, data) {
    requireStateObserver(host.layer.controller);
    observers.add(atom.id);
  }
};

let observers = new Set();

const requireStateObserver = controller => {
  if (!controller._stateOnwriteCache) {
    const writer = controller._stateOnwriteCache = controller.onwrite;
    controller.onwrite = (controller, inputs) => {
      writer(controller, inputs);
      notifyStateObservers(controller);
    };
  }
};

export const notifyStateObservers = controller => {
  for (const observer of observers) {
    controller.onevent(observer, {handler: 'onStateChange'});
  }
};

export const getGraphContent = async specifier => {
  return (specifier?.meta?.id && specifier) 
    || Graphs[specifier] 
    || Project.getGraph(specifier)
    || Document.fetchDocument(globalThis.config.aeon + '/' + specifier)
    ;
};

export const createLayer = async (host, name, graph) => {
  await Controller.reifySublayer(host.layer.controller, host.layer, name, graph, host);
};
