/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/*
 PSA: code in this file is subject to isolation restrictions, including runtime processing.
 Atom module interfaces with 3p code, and is often loaded into isolation contexts.
*/

const O = Object;
const {defineProperty, setPrototypeOf} = O;
const {create, assign, keys, values, entries, mapBy} = {
  create: O.create,
  assign: O.assign,
  keys(o) {
    return o ? O.keys(o) : [];
  },
  values(o) {
    return o ? O.values(o) : [];
  },
  entries(o) {
    return o ? O.entries(o) : [];
  },
  mapBy(a, keyGetter) {
    return a ? O.values(a).reduce((map, item) => (map[keyGetter(item)] = item, map), {}) : {};
  }
};

const scope = globalThis['scope'] ?? globalThis;

const nob = () => create(null);

const privateProperty = initialValue => {
  let value = initialValue;
  return { get: () => value, set: v => value = v };
};

/** */
export class Atom {
  pipe;
  impl;
  internal;
  /** */
  constructor(proto, pipe, beStateful) {
    this.pipe = pipe;
    this.impl = create(proto);
    globalThis.harden?.(this.impl);
    defineProperty(this, 'internal', privateProperty(nob()));
    this.internal.$busy = 0;
    //if (beStateful) {
    this.internal.beStateful = true;
    this.internal.state = nob();
    this.internal.clean = nob();
    //}
  }
  /** */
  get log() {
    return this.pipe?.log || log;
  }
  /** */
  get template() {
    return this.impl?.template;
  }
  /** */
  get config() {
    return {
        template: this.template
    };
  }
  /**
   * set-trap for inputs, so we can do work when inputs change
   */
  set inputs(inputs) {
    //this.log(inputs);
    this.internal.inputs = inputs;
    this.invalidateInputs();
  }
  get inputs() {
    return this.internal.inputs;
  }
  /** */
  get state() {
    return this.internal.state;
  }
  /** */
  isDirty(inputKey) {
    const clean = this.internal.clean;
    const value = this.internal.inputs[inputKey];
    if (deepEqual(value, clean[inputKey])) {
      //console.warn(i, key, value, 'THIS HOUSE IS CLEAN');
      return false;
    }
    clean[inputKey] = value;
    //console.warn(i, key, value, 'was dirty');
    return true;
  }
  /** */
  async service(request, msg, data) {
    if (typeof request === 'string') {
      request = {kind: request, msg, data};
    }
    return this.pipe?.service?.(request);
  }
  /** */
  invalidateInputs() {
    this.internal.$propChanged = true;
    this.invalidate();
  }
  /** 
   validate after the next microtask
  */
  invalidate() {
    if (!this.internal.validator) {
      //this.internal.validator = this.async(this.validate);
      this.internal.validator = timeout(this.validate.bind(this), 1);
    }
  }
  /** 
   call fn after a microtask boundary
  */
  // async(fn) {
  //   return Promise.resolve().then(fn.bind(this));
  // }
  /** 
   activate atom update sequence
  */
  async validate() {
    //this.log('validate');
    if (this.internal.validator) {
      // try..finally to ensure we nullify `validator`
      try {
        this.internal.$validateAfterBusy = this.internal.$busy;
        if (!this.internal.$busy) {
          // if we're not stateful
          if (!this.internal.beStateful) {
            // then it's a fresh state every validation
            this.internal.state = nob();
          }
          // inputs are immutable (changes to them are ignored)
          this.internal.inputs = this.validateInputs();
          // let the impl decide what to do
          await this.maybeUpdate();
        }
      }
      catch (e) {
        log.error(e);
      }
      // nullify validator _after_ methods so state changes don't reschedule validation
      this.internal.validator = null;
      this.internal.$propChanged = false;
    }
  }
  /** */
  validateInputs() {
    return assign(nob(), this.inputs);
  }
  /** */
  implements(methodName) {
    return typeof this.impl?.[methodName] === 'function';
  }
  /** */
  async maybeUpdate() {
    if (!this.checkInit()) {
      await this.doInit();
    }
    let doUpdate = false;
    if (this.implements('update')) {
      doUpdate = 
        !this.implements('shouldUpdate')
        || await (this.shouldUpdate(this.inputs, this.state))
        ;
    }
    if (doUpdate) {
      return this.update();
    }
    else {
      // we might want to render even if we don't update
      this.outputData(null);
    }
  }
  /** */
  checkInit() {
    return this.internal.initialized;
  }
  /** */
  async doInit() {
    this.internal.initialized = true;
    if (this.implements('initialize')) {
      await this.asyncMethod(this.impl.initialize);
    }
  }
  /** */
  async shouldUpdate(inputs, state) {
    // for this method, "not implemented" is true, if implemented, "true" is true
    return !this.implements('shouldUpdate') || await this.impl.shouldUpdate(inputs, state);
  }
  /** */
  update() {
    this.asyncMethod(this.impl?.update);
  }
  /** */
  outputData(data) {
    this.pipe?.output?.(data, this.maybeRender());
  }
  /** */
  maybeRender() {
    if (this.template) {
      const { inputs, state } = this.internal;
      if (!this.implements('shouldRender') || this.impl?.shouldRender?.(inputs, state)) {
        if (this.implements('render')) {
          return this.impl.render(inputs, state);
        }
        else {
          return { ...inputs, ...state };
        }
      }
    }
  }
  /** */
  async handleEvent({ handler, data }) {
    const onhandler = this.impl?.[handler];
    if (onhandler) {
      this.internal.inputs.eventlet = data;
      await this.asyncMethod(onhandler.bind(this.impl), { eventlet: data });
      this.internal.inputs.eventlet = null;
    }
    else {
      //this.log(`event handler [${handler}] not found`);
    }
  }
  /** */
  async asyncMethod(asyncMethod, injections) {
    if (asyncMethod) {
      const { inputs, state } = this.internal;
      const stdlib = {
        service: async (...args) => this.service(...args),
        invalidate: () => this.invalidate(),
        output: async (data) => this.outputData(data),
        isDirty: inputName => this.isDirty(inputName)
      };
      const task = asyncMethod.bind(this.impl, inputs, state, { ...stdlib, ...injections });
      this.outputData(await this.try(task));
      if (!this.internal.$busy && this.internal.$validateAfterBusy) {
        this.invalidate();
      }
    }
  }
  /** */
  async try(asyncFunc) {
    this.internal.$busy++;
    try {
        return await asyncFunc();
    }
    catch (e) {
        log.error(e);
    }
    finally {
        this.internal.$busy--;
    }
  }
}

scope.harden?.(globalThis);
scope.harden?.(Atom);

// log('Any leaked values? Must pass three tests:');
// try { globalThis['sneaky'] = 42; } catch(x) { log('sneaky test: pass'); }
// try { Atom['foo'] = 42; } catch(x) { log('Atom.foo test: pass'); }
// try { log['foo'] = 42; } catch(x) { log('log.foo test: pass'); };

Atom;
