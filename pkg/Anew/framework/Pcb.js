/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Layer from './Layer.js';

const log = logf('Pcb', '#9F2B68');

export const create = (name, bindings, {xenon, onservice, onrender}) => {
  const pcb = {
    name,
    xenon,
    bindings,
    onservice,
    onrender,
    layers: {},
    state: {},
    onoutput: (host, output) => {
      const outputState = {};
      keys(output).map(key => outputState[`${host.layer.name}$${host.name}$${key}`] = output[key]);
      write(pcb, outputState);
    }
  };
  return pcb;
};
  
export const reifyLayer = async (pcb, layers, name, graph, host) => {
  const layer = Layer.create(name, pcb);
  layers[name] = layer;
  layer.host = host;
  await Layer.reify(layer, graph);
  return layer;
};

export const write = (pcb, inputState) => {
  entries(inputState).forEach(([key, value]) => {
    bindamor(pcb, key, value);
    pcb.state[key] = value;
  })
};

const bindamor = (pcb, key, value) => {
  const bound = pcb.bindings?.inputs?.[key];
  if (bound) {
    log.debug(`[${bound}] receives from [${key}] the value`, value);
  }
};

export const setInputs = (pcb, key, inputs) => {
  const [layer, atom] = key.split('$');
  pcb.layers[layer].atoms[key].inputs = inputs;
};
