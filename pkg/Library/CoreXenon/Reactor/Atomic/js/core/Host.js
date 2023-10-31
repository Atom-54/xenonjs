/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {deepEqual, deepCopy} from '../utils/object.js';
import {arand} from '../utils/rand.js';
import {EventEmitter} from './EventEmitter.js';
import {Decorator} from './Decorator.js';
const {entries, keys} = Object;

const customLogFactory = id => logf(`Host (${id})`, arand(logColors));
const logColors = ['#5a189a', '#51168b', '#48137b', '#6b2fa4', '#7b46ae', '#3f116c'];
//const customLogFactory = (id) => logFactory(logFactory.flags.host, `Host (${id})`, arand(['#5a189a', '#51168b', '#48137b', '#6b2fa4', '#7b46ae', '#3f116c']));

/**
 * Host owns metadata (e.g. `id`, `container`) that its Atom is not allowed to access.
 * Host knows how to talk, asynchronously, to its Atom (potentially using a bus).
**/
/* TODO(sjmiles):
Update Cycle Documented Briefly
1. when a Store changes it invokes it's listeners
2. when an App hears a Store change, it updates Hosts bound to the Store
3. App updates Host by creating an `inputs` object from Stores and metadata
   - ignores fact inputs are accumulated
   - ignores information about which Store has updated
4. `inputs` object is assigned to `hosts.inputs` 
5. Host does an expensive `deepEqual` equality check. Turning on `host` logging should reveal `this.log('inputs are not interesting, skipping update');` if data is caught in this trap
   - we can use reference testing here if we are more careful
     about using immutable data
6. the atom.inputs are assigned (but is really a *merge*)
*/
export class Host extends EventEmitter {
  id;
  lastInputs;
  lastOutput;
  lastPacket;
  lastRenderModel;
  log;
  meta;
  atom;
  constructor(id) {
    super();
    this.log = customLogFactory(id);
    this.id = id;
    this.name = id;
  }
  dispose() {
    this.detach();
  }
  onevent(eventlet) {
    this.fire('eventlet', eventlet);
  }
  // Atom and AtomMeta are separate, host specifically integrates these on behalf of Atom
  installAtom(atom, meta) {
    if (this.atom) {
      this.detachAtom();
    }
    if (atom) {
      this.atom = atom;
      this.meta = meta || this.meta;
    }
  }
  get container() {
    return this.meta?.container || 'root';
  }
  detach() {
    this.detachAtom();
  }
  detachAtom() {
    if (this.atom) {
      this.render({ $clear: true });
      this.atom = null;
      this.meta = null;
    }
  }
  async service(request) {
    if (request?.decorate) {
      return Decorator.maybeDecorateModel(request.model, this.atom);
    }
    if (request) {
      const promise = new Promise(resolve => 
        request.resolve = value => {
          delete request.resolve;
          resolve(value);
        }
      );
      this.fire('service', request);
      return promise;
    }
  }
  output(outputModel, renderModel) {
    if (outputModel) {
      this.lastOutput = outputModel;
      this.fire('output', outputModel);
    }
    if (this.template) {
      Decorator.maybeDecorateModel(renderModel, this.atom);
      this.lastRenderModel = { ...renderModel };
      // 'render' event is sent from 'render()'
      this.render(renderModel);
    }
  }
  rerender() {
    // does not re-render Frame/Slot content
    if (this.lastRenderModel) {
      this.render(this.lastRenderModel);
    }
  }
  render(model) {
    const { id, container, template } = this;
    const content = { model, template };
    const packet = { id, container, content };
    this.fire('render', packet);
    this.lastPacket = packet;
  }
  /**/
  set inputs(inputs) {
    if (this.atom && inputs) {
      //let lastInputs = this.atom.internal.inputs ?? this.meta?.staticInputs ?? Object.create(null);
      let lastInputs = this.lastInputs ?? Object.create(null);
      //f (this.dirtyCheck(inputs, lastInputs, this.lastOutput)) {
        this.lastInputs = this.atom.inputs = deepCopy({...lastInputs, ...inputs});
        //this.fire('inputs-changed');
      //}
    }
  }
  dirtyCheck(inputs, lastInputs, lastOutput) {
    const dirtyBits = ([n, v]) => 
      //lastOutput?.[n]  
        //? !deepEqual(lastOutput[n], v)
        //: 
        lastInputs?.[n]
          ? !deepEqual(lastInputs?.[n], v)
          : true
      ;
    return entries(inputs).some(dirtyBits);
  }
  lastInputsLength(lastInputs) {
    return keys(lastInputs).filter(key => !this.meta?.staticInputs?.[key] && key !== 'eventlet').length;
  }
  get config() {
    return this.atom?.config;
  }
  get template() {
    return this.config?.template;
  }
  hasTemplate() {
    return Boolean(this.template);
  }
  invalidate() {
    this.atom?.invalidate();
  }
  handleEvent(eventlet) {
    return this.atom?.handleEvent(eventlet);
  }
}
