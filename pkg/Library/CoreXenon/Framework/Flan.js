/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {values, nob, map} from '../Reactor/safe-object.js';
import * as Binder from './Binder.js';
import * as Layers from './Layers.js';
import * as App from './App.js';

const log = logf('Flan', 'purple', '#eeeeee');

export const Flan = class {
  constructor(emitter, Composer, library, persistations) {
    this.layers = nob();
    this.state = nob();
    this.library = library;
    this.persistations = persistations;
    this.layerFactory = async (graphOrGraphs, name) => App.createLayer(graphOrGraphs, emitter, Composer, this.library.services, name);
    this.atomsFactory = async system => Layers.reifyAtoms(system, emitter);
  }
  async createLayer(graphOrGraphs, name) {
    // TODO(sjmiles): explain order-of-operations here
    const layer = await this.layerFactory(graphOrGraphs, name);
    await this.addLayer(layer);  
    return layer;
  }
  async addLayer(layer) {
    // bookkeep
    layer.flan = this;
    this.layers[layer.name] = layer;
    // initialize data
    const relevantPeristed = nob();
    map(this.persistations, (name, value) => {
      if (name.startsWith(layer.name + '$')) {
        relevantPeristed[name] = value;
      }
    });
    await App.initializeData(layer, relevantPeristed);
    log('installing persisted values:', relevantPeristed);
    App.setData(layer, this.relevant);
  }
  async destroyLayer(layer) {
    // TODO(sjmiles): explain which comes first and why
    App.obliterateLayer(layer);
    this.removeLayer(layer);
  }
  removeLayer(layer) {
    delete this.layers[layer.name];
  }
  forwardStateChanges(inputs) {
    values(this.layers).forEach(layer => {
      const boundInput = Binder.processInput(inputs, layer.bindings.inputBindings);
      boundInput.forEach(({id, inputs}) => layer.atoms[id] && (layer.atoms[id].inputs = inputs));
    }); 
  }
};