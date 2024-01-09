/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from '../../Framework/Controller.js';
import * as Project from '../../Design/Services/ProjectService.js';
//import * as Design from '../../Design/Services/DesignService.js';
import * as FileSystem from '../../Documents/Services/FileSystemService.js';

const Graphs = globalThis.Graphs || {};

export const LayerService = {
  async CreateLayer(host, data) {
    // locating graph data is non-trivial
    const graph = data?.id && await getGraphContent(data.id);
    if (graph) {
      const name = `${host.layer.name}$${host.name}`;
      const graphLayer = await createLayer(host, name, graph);
      host.addDetachment(() => destroyLayer(graphLayer));
      // TODO(sjmiles): Design may not exist, we need to do this another way
      //Design.designUpdate(host.layer.controller);
    }
  },
  async ObserveState(host, data) {
    requireStateObserver(host.layer.controller);
    let id = host.id.split('$').slice(0, -1).join('$') + '$' + data;
    observers.add(id);
    host.addDetachment(() => observers.delete(id));
  }
};

export const getGraphContent = async specifier => {
  return (specifier?.meta?.id && specifier) 
    || Graphs[specifier] 
    || Project.getGraph(specifier)
    || FileSystem.getItem(null, globalThis.config.aeon + '/' + specifier)
    ;
};

export const createLayer = async (host, name, graph) => {
  return Controller.reifySublayer(host.layer.controller, host.layer, name, graph, host);
};

const destroyLayer = async layer => {
  return Controller.removeLayer(layer.controller, layer);
};


let observers = new Set();

const requireStateObserver = controller => {
  if (!controller._stateOnwriteCache) {
    const writer = controller._stateOnwriteCache = controller.onwrite;
    controller.onwrite = inputs => {
      writer?.(inputs);
      notifyStateObservers(controller);
    };
  }
};

export const notifyStateObservers = controller => {
  const handler = 'onStateChange';
  for (const observer of observers) {
    const data = stratifyState(getLayerState(controller, observer));
    controller.onevent(observer, {handler, data});
  }
};

const getLayerState = ({state}, layerId) => {
  const layerPrefix = layerId.split('$').slice(0, -2).join('$') + '$Graph$';
  const layerKeys = Object.keys(state).filter(key => key.startsWith(layerPrefix));
  const layerState = {};
  layerKeys.forEach(key => layerState[key.slice(layerPrefix.length)] = state[key]);
  return layerState;
};

const stratifyState = raw => {
  const state = {};
  Object.entries(raw).forEach(([key, value]) => {
    const keys = key.split('$');
    const name = keys.pop();
    let level = state;
    for (const strata of keys) {
      level = (level[strata] ??= {});
    }
    level[name] = value;
  });
  return state;
};