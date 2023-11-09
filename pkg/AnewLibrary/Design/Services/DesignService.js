/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from '../../Framework/Controller.js';
import * as Schema from '../../Framework/Schema.js';
import * as Mouse from '../../../Anew/common/mouse.js';
import {atomInfo} from '../../../Anew/common/atomInfo.js';

const log = logf('DesignService', 'burgandy', 'white');

let designLayerId = 'build$Design';

export const DesignService = {
  async SetDesignLayerIndex(host, {index}) {
    const layerId = ['build$Designable', 'build$Designable2'][index];
    if (layerId) {
      DesignService.SetDesignLayer(host, {layerId});
    }
  },
  async SetDesignLayer(host, {layerId}) {
    designLayerId = layerId;
    return designUpdate(host.layer.controller);
  },
  Select(host, {atomId}) {
    designSelect(host.layer.controller);
  },
  async UpdateDesigner(host) {
    return designUpdate(host.layer.controller);
  },
  async GetAtomTypes() {
    const types = Object.entries(atomInfo).map(([key, info]) => ({name: key, displayName: key, ...info}));
    return {
      category: 'All',
      atoms: types
    }
  },
  async GetAtomInfo(host, data) {
    return getAtomInfo(host.layer.controller, designLayerId);
  },
  async GetLayerInfo(host, {layerId}) {
    const {controller} = host.layer;
    const schema = Schema.schemaForLayer(controller, layerId);
    const atoms = getAtomInfo(controller, layerId);
    return {atoms, schema};
  },
  DesignDragEnter(host, {eventlet}) {
    let elt = dragTarget(host, eventlet);
    if (elt) {
      elt.style.outline = '5px dashed orange';
      elt.style.outlineOffset = '-2px';
    }  
  },
  DesignDragLeave(host, {eventlet}) {
    let elt = dragTarget(host, eventlet);
    if (elt) {
      elt.style.outline = null;
    }  
  },
  async DesignDragDrop(host, {eventlet}) {
    const types = await DesignService.GetAtomTypes();
    const dropType = types.atoms.find(({name}) => name === eventlet.value);
    log.debug(eventlet, dropType);
    let elt = dragTarget(host, eventlet);
    if (elt) {
      elt.style.outline = null;
      elt.style.outline = '5px dashed green';
    }
    const {controller} = host.layer;
    
    let container = eventlet.key.includes('#') && eventlet.key;
    if (!container) {
      const targetHost = controller.atoms[eventlet.key.replace(/_/g, '$')];
      container = targetHost.container;
    }
    const targetLayer = designLayerId;
    const layer = Controller.findLayer(controller, targetLayer);
    const name = dropType.name + Math.floor(Math.random()*100);
    const type = dropType.type; //'$library/Spectrum/Atoms/SpectrumButton';
    const state = {
      label: 'Dropped Button',
      style: {
        flex: '0 0 auto'
      }
    };
    log.debug({name, container, state});
    // TODO(sjmiles): this is added back in reifyAtom
    container = container.slice(targetLayer.length + 1);
    await Controller.reifyAtom(controller, layer, {name, type, container, state});
    designUpdate(controller);
  }
};

export const designUpdate = async controller => {
  Mouse.init(controller, designLayerId);
  const types = await DesignService.GetAtomTypes();
  Controller.set(controller, 'build$Catalog$Catalog', {items: [types]});
  Controller.writeInputsToHost(controller, 'build$AtomTree', {junk: Math.random()});
  Controller.writeInputsToHost(controller, 'build$NodeGraph', {layerId: designLayerId, junk: Math.random()});
};

export const designSelect = (controller, atomId) => {
  const host = controller.atoms[atomId];
  Controller.writeInputsToHost(controller, 'build$Inspector$Echo', {html: `<h4 style="text-align: center;">${host.id.replace(designLayerId + '$', '').replace(/\$/g, '.')}</h4>`});
  const schema = Schema.schemaForHost(host).inputs;
  const candidates = Schema.schemaForController(controller, designLayerId).outputs;
  Controller.writeInputsToHost(controller, 'build$Inspector$Inspector', {id: host.id, schema, candidates});
  const state = prefixedState(controller.state, host.id + '$');
  Controller.writeInputsToHost(controller, 'build$State', {object: state});
};

const prefixedState = (state, prefix)=> {
  const prefixedState = {};
  entries(state).forEach(([id, value]) => {
    if (id.startsWith(prefix)) {
      prefixedState[id.slice(prefix.length).replace(/\$/g, '.')] = value;
    }
  });
  return prefixedState;
};

const getAtomInfo = (controller, layerId) => {
  const result = Object.entries(controller.atoms)
    .filter(([id, atom]) => id.startsWith(layerId + '$'))
    .map(([id, atom]) => ({
      id,
      type: atom.type.split('/').pop(),
      container: atom.container
    }))
  ;
  result.designLayerId = layerId;
  return result;
};

const dragTarget = (host, eventlet) => {
  const targetLayer = host.layer.selectedDesignLayerId || 'build_Design';
  const hostId = eventlet.key.includes('#') ? eventlet.key.split('#').shift() : eventlet.key;
  let elt = validTarget(document.querySelector('#' + hostId), targetLayer);
  return elt;
};

const validTarget = (elt, targetId) => {
  const root = document.querySelector(`#${targetId}`);
  if (root) { 
    if (root.contains(elt)) {
      return elt.closest('[atom]');
    }
  }
};
