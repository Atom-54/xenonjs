/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const {defineProperty, create, assign, getOwnPropertyNames} = Object;
// const {keys, values, entries} = ({
//   keys: o => o ? Object.keys(o) : [],
//   values: o => o ? Object.values(o) : [],
//   entries: o => o ? Object.entries(o) : []
// });

const timeout = async (func, delayMs) => new Promise(resolve => setTimeout(() => resolve(func()), delayMs));

export const deepEqual = (a, b) => {
  const typeA = typeof a;
  // must be same type to be equal
  if (typeA === typeof b) {
    // we are `deep` because we recursively study objects
    if (typeA === 'object' && a && b) {
      const aProps = getOwnPropertyNames(a);
      const bProps = getOwnPropertyNames(b);
      // equal if same # of props, and no prop is not deepEqual
      return (aProps.length == bProps.length) && !aProps.some(name => !deepEqual(a[name], b[name]));
    }
    // otherwse, perform simple comparison
    return (a === b);
  }
};

const privateProperty = initialValue => {
  let value = initialValue;
  return { get: () => value, set: v => value = v };
};

const scope = globalThis['scope'] ?? globalThis;

export class Atom {
  pipe;
  impl;
  internal;
  constructor(proto, pipe, beUnStateful) {
    this.pipe = pipe;
    this.impl = create(proto);
    globalThis.harden?.(this.impl);
    defineProperty(this, 'internal', privateProperty(create(null)));
    this.internal.$busy = 0;
    if (!beUnStateful) {
      this.internal.beStateful = true;
      this.internal.state = create(null);
      this.internal.clean = create(null);
    }
  }
  // get log() {
  //   return this.pipe?.log || nop;
  // }
  get template() {
    return this.impl?.template;
  }
  get config() {
    return {
        template: this.template
    };
  }
  // set-trap for inputs, so we can do work when inputs change
  set inputs(inputs) {
    //this.log(inputs);
    this.internal.inputs = inputs;
    this.invalidateInputs();
  }
  get inputs() {
    return this.internal.inputs;
  }
  get state() {
    return this.internal.state;
  }
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
  async service(request, msg, data) {
    if (typeof request === 'string') {
      request = {kind: request, msg, data};
    }
    return this.pipe?.service?.(request);
  }
  invalidateInputs() {
    this.internal.$propChanged = true;
    this.invalidate();
  }
  // validate after the next microtask
  invalidate() {
    if (!this.internal.validator) {
      //this.internal.validator = this.async(this.validate);
      this.internal.validator = timeout(this.validate.bind(this), 1);
    }
  }
  // call fn after a microtask boundary
  async(fn) {
    return Promise.resolve().then(fn.bind(this));
  }
  // activate atom lifecycle
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
            this.internal.state = create(null);
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
  validateInputs() {
    return assign(create(null), this.inputs);
  }
  implements(methodName) {
    return typeof this.impl?.[methodName] === 'function';
  }
  async maybeUpdate() {
    if (!this.checkInit()) {
      await this.doInit();
    }
    let doUpdate = false;
    if (this.implements('update')) {
      doUpdate = 
        !this.implements('shouldUpdate')
        || await (this.shouldUpdate(this.inputs, this.state, this.getTools()))
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
  checkInit() {
    return this.internal.initialized;
  }
  async doInit() {
    this.internal.initialized = true;
    if (this.implements('initialize')) {
      await this.asyncMethod(this.impl.initialize);
    }
  }
  async shouldUpdate(inputs, state, tools) {
    // if unimplemented, shouldUpdate is "true" by default
    return !this.implements('shouldUpdate') || await this.impl.shouldUpdate(inputs, state, tools);
  }
  update() {
    this.asyncMethod(this.impl?.update);
  }
  outputData(data) {
    this.pipe?.output?.(data, this.maybeRender());
  }
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
  getTools() {
    return {
      service: async (...args) => this.service(...args),
      invalidate: () => this.invalidate(),
      output: async (data) => this.outputData(data),
      isDirty: inputName => this.isDirty(inputName)
    };
  }
  async asyncMethod(asyncMethod, injections) {
    if (asyncMethod) {
      const { inputs, state } = this.internal;
      const stdlib = this.getTools();
      const task = asyncMethod.bind(this.impl, inputs, state, { ...stdlib, ...injections });
      this.outputData(await this.try(task));
      if (!this.internal.$busy && this.internal.$validateAfterBusy) {
        this.invalidate();
      }
    }
  }
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
