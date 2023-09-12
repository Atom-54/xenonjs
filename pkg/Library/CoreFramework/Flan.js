/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {SafeObject} from '../CoreReactor/safe-object.js';
import * as Binder from './Binder.js';

const log = logf('Flan', 'purple', '#eeeeee');
logf.flags.Flan = true;

export const Flan = class {
  constructor(App, emitter, Composer, services, persistations) {
    this.App = App;
    this.emitter = emitter;
    this.Composer = Composer;
    this.services = services;
    this.persistations = persistations;
    this.layers = Object.create(null);
    this.state = Object.create(null);
  }
  async createLayer(graphOrGraphs, name) {
    const layer = await this.App.createLayer(graphOrGraphs, this.emitter, this.Composer, this.services, name);
    await this.addLayer(layer);  
    return layer;
  }
  async addLayer(layer) {
    // bookkeep
    layer.flan = this;
    this.layers[layer.name] = layer;
    // initialize data
    await this.App.initializeData(layer);
    // TODO(sjmiles): might need to do this in concert with initializeData?
    this.App.setData(layer, this.persistations);
  }
  async destroyLayer(layer) {
    this.App.obliterateLayer(layer);
    delete this.layers[layer.name];
  }
  forwardStateChanges(inputs) {
    SafeObject.values(this.layers).forEach(layer => {
      const boundInput = Binder.processInput(inputs, layer.bindings.inputBindings);
      //log(layer.name, boundInput);
      boundInput.forEach(({id, inputs}) => layer.atoms[id] && (layer.atoms[id].inputs = inputs));
    }); 
  }
};