/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// import {deepEqual, deepCopy} from '../utils/object.js';
// import {arand} from '../utils/rand.js';
//import {EventEmitter} from './EventEmitter.js';
// import {Decorator} from './Decorator.js';

const {entries, keys} = Object;

const logColors = ['#5a189a', '#51168b', '#48137b', '#6b2fa4', '#7b46ae', '#3f116c'];
const customLogFactory = id => logf(`Host (${id})`, arand(logColors));

export class Host /*extends EventEmitter*/ {
  id;
  lastInputs;
  lastOutput;
  lastPacket;
  lastRenderModel;
  //log;
  atom;
  detachments;
  constructor(atom, props) {
    this.detachments = [];
    Object.assign(this, props);
    this.installAtom(atom);
  }
  dispose() {
    this.detachAtom();
  }
  // Atom has no direct access to AtomMeta, only
  // as mediated by Host
  installAtom(atom, meta) {
      //this.meta = meta || this.meta;
      if (this.atom) {
      this.detachAtom();
    }
    if (atom) {
      this.atom = atom;
      Object.assign(atom.pipe, {
        output: (outputModel, renderModel) => this.onoutput(outputModel, renderModel),
        service: request => this.onservice(request)
      });
    }
  }
  addDetachment(task) {
    this.detachments.push(task);
  }
  detachAtom() {
    const detachments = this.detachments;
    this.detachments = null;
    detachments.forEach(task => task());
    if (this.atom) {
      this.unrender();
      this.atom = null;
    }
  }
  unrender() {
    this.render({$clear: true});
  }
  get template() {
    return this.atom?.template;
  }
  invalidate() {
    this.atom?.invalidate();
  }
  set inputs(inputs) {
    if (this.atom && inputs) {
      //let lastInputs = this.lastInputs ?? Object.create(null);
      //f (this.dirtyCheck(inputs, lastInputs, this.lastOutput)) {
      this.lastInputs = {...this.lastInputs, ...inputs};
      this.atom.inputs = this.lastInputs;
      //this.lastInputs = this.atom.inputs = deepCopy({...lastInputs, ...inputs});
        //this.fire('inputs-changed');
      //}
    }
  }
  onoutput(outputModel, renderModel) {
    if (outputModel) {
      this.lastOutput = outputModel;
      this.switchboard.output(outputModel);
    }
    if (this.template) {
      //Decorator.maybeDecorateModel(renderModel, this.atom);
      this.lastRenderModel = {...renderModel};
      const packet = this.render(renderModel);
      this.switchboard.render(packet);
    }
  }
  async onservice(request) {
    // if (request?.decorate) {
    //   return Decorator.maybeDecorateModel(request.model, this.atom);
    // }
    if (request) {
      return await this.switchboard.service(request);
    }
  }
  onevent(eventlet) {
    return this.atom?.handleEvent(eventlet);
  }
  rerender() {
    // does not re-render Frame/Slot content
    //if (this.lastRenderModel) {
      this.render(this.lastRenderModel);
    //}
  }
  render(model) {
    const {id, container, template} = this;
    return this.lastPacket = {id, container, model, template};
  }
  // dirtyCheck(inputs, lastInputs, lastOutput) {
  //   const dirtyBits = ([n, v]) => 
  //     //lastOutput?.[n]  
  //       //? !deepEqual(lastOutput[n], v)
  //       //: 
  //       lastInputs?.[n]
  //         ? !deepEqual(lastInputs?.[n], v)
  //         : true
  //     ;
  //   return entries(inputs).some(dirtyBits);
  // }
  // lastInputsLength(lastInputs) {
  //   return keys(lastInputs).filter(key => !this.meta?.staticInputs?.[key] && key !== 'eventlet').length;
  // }
  // get atomConfig() {
  //   return this.atom?.config;
  // }
}
