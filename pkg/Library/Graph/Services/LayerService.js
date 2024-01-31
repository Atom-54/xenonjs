/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from '../../Framework/Controller.js';
import * as FileSystem from '../../Documents/Services/FileSystemService.js';
import {Resources} from '../../Resources/Resources.js';

export const LayerService = {
  async CreateLayer(host, data) {
    const detach = () => {
      if (host.graphLayer) {
        destroyLayer(host.graphLayer);
        host.graphLayer = null;
      }
    };
    detach();
    // locating graph data is non-trivial
    const graph = data?.id && await getGraphContent(data.id);
    if (graph) {
      const name = `${host.layer.name}$${host.name}`;
      host.graphLayer = await createLayer(host, name, graph);
      // may end up with more than one (harmless) copy of this detachment
      host.addDetachment(detach);
    }
  },
  async CreateAtom(host, data) {
    const lastAtom = Resources.get(host.id);
    if (lastAtom) {
      lastAtom.dispose();
    }
    const hostName = host.id.split('$').pop();
    const container = hostName + '#Container';
    const atomName = hostName + 'TrialAtom';
    const simpleId = host.id.replaceAll('$', '_').replaceAll(' ', '');
    const atomType = data.atomType || (simpleId + 'Type');
    //log.warn('calling LayerService::CreateAtom(', {container, atomName, atomType, atomCode: data.atomCode}, ')');
    const atom = await createAtom(host.layer, container, atomName, atomType, data.atomCode);
    Resources.set(host.id, atom);
    return atom;
  },
  async ObserveState(host, data) {
    requireStateObserver(host.layer.controller);
    let id = host.id;
    if (data) {
      id = [...id.split('$').slice(0, -1), data].join('$')
    }
    observers.add(id);
    host.addDetachment(() => observers.delete(id));
  }
};

export const getGraphContent = async specifier => {
  return (specifier && typeof specifier === 'object') ? specifier : 
    globalThis.Graphs?.[specifier] || FileSystem.getItem(null, specifier)
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

const createAtom = async (layer, container, name, type, code) => {
  return Controller.reifyAtom(layer.controller, layer, {name, type, code, container});
};