// ../Utils/logf.js
var logKinds = ["log", "warn", "error", "group", "groupCollapsed", "groupEnd"];
var importantKinds = ["warn", "error"];
var formatter = (preamble, bg, color) => {
  const style = `background: ${bg || "gray"}; color: ${color || "white"}; padding: 1px 6px 2px 7px; border-radius: 6px 0 0 6px;`;
  return [`%c${preamble}`, style];
};
var logs = [];
var createLogFactory = () => {
  const flags = globalThis.config?.logFlags || {};
  const logf3 = (preamble, bg, color) => {
    const format = formatter(preamble, bg, color);
    const make = (kind) => (...args) => {
      const when = Date.now();
      const vicinity = Error().stack.split("\n").slice(1);
      let spot = vicinity.shift();
      while (spot.includes("xen-async") || spot.includes("xenon-atomic") || spot.includes("logf")) {
        spot = vicinity.shift();
      }
      const where = spot?.split?.("/").pop().split?.(")").shift();
      append(preamble, format, kind, when, where, args, logs);
      consolate(flags, preamble, format, kind, when, where, args);
    };
    const log3 = make("log");
    logKinds.forEach((k) => log3[k] = make(k));
    log3.flags = flags;
    log3.get = logf3.get;
    log3.clear = logf3.clear;
    log3.replay = logf3.replay;
    return log3;
  };
  const append = (preamble, format, kind, when, where, args) => {
    const o = /* @__PURE__ */ Object.create(null);
    Object.assign(o, { preamble, format, kind, where, when });
    if (args?.length) {
      o.args = args;
    }
  };
  const consolate = (flags2, preamble, format, kind, when, where, args) => {
    const flag = preamble.split(":").shift();
    if (!flags2 || flags2?.[flag] || importantKinds.includes(kind)) {
      console[kind].apply(console, [...format, ...args || [], `	[${where}]`]);
    }
  };
  logf3.flags = flags;
  logf3.get = () => logs;
  logf3.clear = () => logs.splice(0, -1);
  logf3.replay = (customFlags, filter) => {
    console.group.apply(console, [...formatter("Logger", "white", "gray"), "Replay"]);
    logs.filter(filter ?? ((i) => i)).forEach(({ preamble, format, kind, when, where, args }) => {
      consolate(customFlags, preamble, format, kind, when, where, args);
    });
    console.groupEnd();
  };
  return logf3;
};
if (globalThis.logf) {
  console.warn("attempted global logf overwrite");
} else {
  globalThis.logf = createLogFactory();
}
var logf2 = globalThis.logf;

// ../Utils/rand.js
var { floor, pow, random } = Math;
var key = (digits) => floor((1 + random() * 9) * pow(10, digits - 1));
var irand = (range) => floor(random() * range);
var arand = (array) => array[irand(array.length)];
var prob = (probability) => Boolean(random() < probability);

// ../Utils/id.js
var makeId = (pairs, digits, delim) => {
  pairs = pairs || 2;
  digits = digits || 2;
  delim = delim || "-";
  const min = Math.pow(10, digits - 1);
  const range = Math.pow(10, digits) - min;
  const result = [];
  for (let i = 0; i < pairs; i++) {
    result.push(`${irand(range - min) + min}`);
  }
  return result.join(delim);
};

// ../Utils/object.js
var shallowUpdate = (obj, data) => {
  let result = data;
  if (!data) {
  } else if (Array.isArray(data)) {
    if (!Array.isArray(obj)) {
      obj = [];
    }
    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      if (obj[i] !== value) {
        obj[i] = value;
      }
    }
    const overage = obj.length - data.length;
    if (overage > 0) {
      obj.splice(data.length, overage);
    }
  } else if (typeof data === "object") {
    result = obj && typeof obj === "object" ? obj : /* @__PURE__ */ Object.create(null);
    const seen = {};
    Object.keys(data).forEach((key2) => {
      result[key2] = data[key2];
      seen[key2] = true;
    });
    Object.keys(result).forEach((key2) => {
      if (!seen[key2]) {
        delete result[key2];
      }
    });
  }
  return result;
};
var shallowMerge = (obj, data) => {
  if (data == null) {
    return null;
  }
  if (typeof data === "object") {
    const result = obj && typeof obj === "object" ? obj : /* @__PURE__ */ Object.create(null);
    Object.keys(data).forEach((key2) => result[key2] = data[key2]);
    return result;
  }
  return data;
};
var deepMerge = (obj, data) => {
  if (data !== null) {
    if (typeof data === "object" && !Array.isArray(data)) {
      const result = obj && typeof obj === "object" ? obj : /* @__PURE__ */ Object.create(null);
      Object.keys(data).forEach((key2) => result[key2] = deepMerge(result[key2], data[key2]));
      return result;
    }
    return data;
  }
  return obj;
};
function deepCopy(datum) {
  if (!datum) {
    return datum;
  } else if (Array.isArray(datum)) {
    return datum.map((element) => deepCopy(element));
  } else if (typeof datum === "object") {
    const clone = /* @__PURE__ */ Object.create(null);
    Object.entries(datum).forEach(([key2, value]) => {
      clone[key2] = deepCopy(value);
    });
    return clone;
  } else {
    return datum;
  }
}
var deepEqual2 = (a, b) => {
  const type = typeof a;
  if (type !== typeof b) {
    return false;
  }
  if (type === "object" && a && b) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    return aProps.length == bProps.length && !aProps.some((name) => !deepEqual2(a[name], b[name]));
  }
  return a === b;
};
var deepUndefinedToNull = (obj) => {
  if (obj === void 0) {
    return null;
  }
  if (obj && typeof obj === "object") {
    const props = Object.getOwnPropertyNames(obj);
    props.forEach((name) => {
      const prop = obj[name];
      if (prop === void 0) {
        delete obj[name];
      } else {
        deepUndefinedToNull(prop);
      }
    });
  }
  return obj;
};

// ../Utils/safe-object.js
var O = Object;
var SafeObject = {
  create: O.create,
  assign: O.assign,
  nob() {
    return O.create(null);
  },
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
    return SafeObject.values(a).reduce((map2, item) => (map2[keyGetter(item)] = item, map2), SafeObject.nob());
  },
  map(o, visitor) {
    return SafeObject.entries(o).map(([key2, value]) => visitor(key2, value));
  }
};
var { create, assign, keys, values, entries, nob, map, mapBy } = SafeObject;

// ../Utils/paths.js
var PathMapper = class {
  map;
  constructor(root2) {
    this.map = {};
    this.setRoot(root2);
  }
  add(mappings) {
    Object.assign(this.map, mappings || {});
  }
  resolve(path) {
    let last;
    do {
      path = this._resolve(last = path);
    } while (last !== path);
    return path;
  }
  _resolve(path) {
    const bits = path.split("/");
    const top = bits.shift();
    const prefix = this.map[top] || top;
    return [prefix, ...bits].join("/");
  }
  setRoot(root2) {
    if (root2.length && root2[root2.length - 1] === "/") {
      root2 = root2.slice(0, -1);
    }
    this.add({
      "$root": root2,
      "$xenon": root2
    });
  }
  getAbsoluteHereUrl(meta, depth) {
    const localRelative = meta.url.split("/").slice(0, -(depth ?? 1)).join("/");
    if (!globalThis?.document) {
      return localRelative;
    } else {
      let base = document.URL;
      if (base[base.length - 1] !== "/") {
        base = `${base.split("/").slice(0, -1).join("/")}/`;
      }
      let localAbsolute = new URL(localRelative, base).href;
      if (localAbsolute[localAbsolute.length - 1] === "/") {
        localAbsolute = localAbsolute.slice(0, -1);
      }
      return localAbsolute;
    }
  }
};
var root = "";
var Paths = globalThis["Paths"] = new PathMapper(root ?? "");
Paths.add(globalThis.config?.paths);

// ../Atomic/Atom.js
var O2 = Object;
var { defineProperty, setPrototypeOf } = O2;
var { create: create2, assign: assign2, keys: keys2, values: values2, entries: entries2, mapBy: mapBy2 } = {
  create: O2.create,
  assign: O2.assign,
  keys(o) {
    return o ? O2.keys(o) : [];
  },
  values(o) {
    return o ? O2.values(o) : [];
  },
  entries(o) {
    return o ? O2.entries(o) : [];
  },
  mapBy(a, keyGetter) {
    return a ? O2.values(a).reduce((map2, item) => (map2[keyGetter(item)] = item, map2), {}) : {};
  }
};
var scope = globalThis["scope"] ?? globalThis;
var nob2 = () => create2(null);
var privateProperty = (initialValue) => {
  let value = initialValue;
  return { get: () => value, set: (v) => value = v };
};
var Atom = class {
  pipe;
  impl;
  internal;
  /** */
  constructor(proto, pipe, beStateful) {
    this.pipe = pipe;
    this.impl = create2(proto);
    globalThis.harden?.(this.impl);
    defineProperty(this, "internal", privateProperty(nob2()));
    this.internal.$busy = 0;
    this.internal.beStateful = true;
    this.internal.state = nob2();
    this.internal.clean = nob2();
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
      return false;
    }
    clean[inputKey] = value;
    return true;
  }
  /** */
  async service(request, msg, data) {
    if (typeof request === "string") {
      request = { kind: request, msg, data };
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
    if (this.internal.validator) {
      try {
        this.internal.$validateAfterBusy = this.internal.$busy;
        if (!this.internal.$busy) {
          if (!this.internal.beStateful) {
            this.internal.state = nob2();
          }
          this.internal.inputs = this.validateInputs();
          await this.maybeUpdate();
        }
      } catch (e) {
        log.error(e);
      }
      this.internal.validator = null;
      this.internal.$propChanged = false;
    }
  }
  /** */
  validateInputs() {
    return assign2(nob2(), this.inputs);
  }
  /** */
  implements(methodName) {
    return typeof this.impl?.[methodName] === "function";
  }
  /** */
  async maybeUpdate() {
    if (!this.checkInit()) {
      await this.doInit();
    }
    let doUpdate = false;
    if (this.implements("update")) {
      doUpdate = !this.implements("shouldUpdate") || await this.shouldUpdate(this.inputs, this.state);
    }
    if (doUpdate) {
      return this.update();
    } else {
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
    if (this.implements("initialize")) {
      await this.asyncMethod(this.impl.initialize);
    }
  }
  /** */
  async shouldUpdate(inputs, state) {
    return !this.implements("shouldUpdate") || await this.impl.shouldUpdate(inputs, state);
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
      if (!this.implements("shouldRender") || this.impl?.shouldRender?.(inputs, state)) {
        if (this.implements("render")) {
          return this.impl.render(inputs, state);
        } else {
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
    } else {
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
        isDirty: (inputName) => this.isDirty(inputName)
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
    } catch (e) {
      log.error(e);
    } finally {
      this.internal.$busy--;
    }
  }
};
scope.harden?.(globalThis);
scope.harden?.(Atom);

// ../Atomic/EventEmitter.js
var EventEmitter = class {
  // map of event name to listener array
  listeners = {};
  getEventListeners(eventName) {
    return this.listeners[eventName] || (this.listeners[eventName] = []);
  }
  fire(eventName, ...args) {
    const listeners = this.getEventListeners(eventName);
    if (listeners?.forEach) {
      listeners.forEach((listener) => listener(...args));
    }
  }
  listen(eventName, listener, listenerName) {
    if (!listener) {
      console.warn("Got a null listener", eventName);
      return;
    }
    const listeners = this.getEventListeners(eventName);
    listeners.push(listener);
    listener._name = listenerName || "(unnamed listener)";
    return listener;
  }
  unlisten(eventName, listener) {
    const list = this.getEventListeners(eventName);
    const index = typeof listener === "string" ? list.findIndex((l) => l._name === listener) : list.indexOf(listener);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      console.warn("failed to unlisten from", eventName);
    }
  }
};

// ../Atomic/Decorator.js
var { values: values3, entries: entries3 } = Object;
var opaqueData = {};
var log2 = logf("Decorator", "plum");
var Decorator = {
  /** */
  setOpaqueData(name, data) {
    opaqueData[name] = data;
    return name;
  },
  /** */
  getOpaqueData(name) {
    return opaqueData[name];
  },
  /** */
  maybeDecorateModel(model, atom) {
    if (model && !Array.isArray(model)) {
      values3(model).forEach((item) => {
        if (item && typeof item === "object") {
          if (item["models"]) {
            log2("applying decorator(s) to list:", item);
            this.maybeDecorateItem(item, atom);
          } else {
            if (model?.filter || model?.decorator || model?.collateBy) {
              log2("scanning for lists in sub-model:", item);
              this.maybeDecorateModel(item, atom);
            }
          }
        }
      });
    }
    return model;
  },
  /** */
  maybeDecorateItem(item, atom) {
    let models = typeof item.models === "string" ? this.getOpaqueData(item.models) : item.models;
    if (models) {
      models = maybeDecorate(models, item.decorator, atom);
      models = maybeFilter(models, item.filter, atom.impl);
      models = maybeCollateBy(models, item);
      item.models = models;
    }
  }
};
var maybeDecorate = (models, decorator, atom) => {
  decorator = atom.impl[decorator] ?? decorator;
  const { inputs, state } = atom.internal;
  if (decorator) {
    const immutableInputs = Object.freeze(deepCopy(inputs));
    const immutableState = Object.freeze(deepCopy(state));
    models = models.map((model) => {
      model.privateData = model.privateData || {};
      const immutableModel = Object.freeze(deepCopy(model));
      const decorated = decorator(immutableModel, immutableInputs, immutableState);
      model.privateData = decorated.privateData;
      return { ...decorated, ...model };
    });
    models.sort(sortByLc("sortKey"));
    log2("decoration was performed");
  }
  return models;
};
var maybeFilter = (models, filter, impl) => {
  filter = impl[filter] ?? filter;
  if (filter && models) {
    models = models.filter(filter);
  }
  return models;
};
var maybeCollateBy = (models, item) => {
  entries3(item).forEach(([name, collator]) => {
    if (collator?.["collateBy"]) {
      const collation = collate(models, collator["collateBy"]);
      models = collationToRenderModels(collation, name, collator["$template"]);
    }
  });
  return models;
};
var sort = (a, b) => a < b ? -1 : a > b ? 1 : 0;
var sortByLc = (key2) => (a, b) => sort(String(a[key2]).toLowerCase(), String(b[key2]).toLowerCase());
var collate = (models, collateBy) => {
  const collation = {};
  models.forEach((model) => {
    const keyValue = model[collateBy];
    if (keyValue) {
      const category = collation[keyValue] || (collation[keyValue] = []);
      category.push(model);
    }
  });
  return collation;
};
var collationToRenderModels = (collation, name, $template) => {
  return entries3(collation).map(([key2, models]) => ({
    key: key2,
    [name]: { models, $template },
    single: !(models["length"] !== 1),
    ...models?.[0]
  }));
};

// ../Atomic/Host.js
var { entries: entries4, keys: keys3 } = Object;
var customLogFactory = (id) => logf(`Host (${id})`, arand(logColors));
var logColors = ["#5a189a", "#51168b", "#48137b", "#6b2fa4", "#7b46ae", "#3f116c"];
var Host = class extends EventEmitter {
  /** */
  id;
  /** */
  lastOutput;
  /** */
  lastPacket;
  /** */
  lastRenderModel;
  /** */
  log;
  /** */
  meta;
  /** */
  atom;
  /** */
  constructor(id) {
    super();
    this.log = customLogFactory(id);
    this.id = id;
    this.name = id;
  }
  /** */
  dispose() {
    this.detach();
  }
  /** */
  onevent(eventlet) {
    this.fire("eventlet", eventlet);
  }
  /** */
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
  /** */
  get container() {
    return this.meta?.container || "root";
  }
  /** */
  detach() {
    this.detachAtom();
  }
  /** */
  detachAtom() {
    if (this.atom) {
      this.render({ $clear: true });
      this.atom = null;
      this.meta = null;
    }
  }
  /** */
  async service(request) {
    if (request?.decorate) {
      return Decorator.maybeDecorateModel(request.model, this.atom);
    }
    if (request) {
      const promise = new Promise(
        (resolve) => request.resolve = (value) => {
          delete request.resolve;
          resolve(value);
        }
      );
      this.fire("service", request);
      return promise;
    }
  }
  /** */
  output(outputModel, renderModel) {
    if (outputModel) {
      this.lastOutput = outputModel;
      this.fire("output", outputModel);
    }
    if (this.template) {
      Decorator.maybeDecorateModel(renderModel, this.atom);
      this.lastRenderModel = { ...renderModel };
      this.render(renderModel);
    }
  }
  /** */
  render(model) {
    const { id, container, template } = this;
    const content = { model, template };
    const packet = { id, container, content };
    this.fire("render", packet);
    this.lastPacket = packet;
  }
  /** */
  rerender() {
    if (this.lastRenderModel) {
      this.render(this.lastRenderModel);
    }
  }
  /**/
  set inputs(inputs) {
    if (this.atom && inputs) {
      let lastInputs = this.atom.internal.inputs ?? this.meta?.staticInputs ?? /* @__PURE__ */ Object.create(null);
      this.atom.inputs = deepCopy({ ...lastInputs, ...inputs });
      this.fire("inputs-changed");
    }
  }
  /**/
  dirtyCheck(inputs, lastInputs, lastOutput) {
    const dirtyBits = ([n, v]) => lastOutput?.[n] && !deepEqual2(lastOutput[n], v) || !deepEqual2(lastInputs?.[n], v);
    return !lastInputs || entries4(inputs).length !== this.lastInputsLength(lastInputs) || entries4(inputs).some(dirtyBits);
  }
  /**/
  lastInputsLength(lastInputs) {
    return keys3(lastInputs).filter((key2) => !this.meta?.staticInputs?.[key2] && key2 !== "eventlet").length;
  }
  /**/
  get config() {
    return this.atom?.config;
  }
  /**/
  get template() {
    return this.config?.template;
  }
  /**/
  hasTemplate() {
    return Boolean(this.template);
  }
  /**/
  invalidate() {
    this.atom?.invalidate();
  }
  /**/
  handleEvent(eventlet) {
    return this.atom?.handleEvent(eventlet);
  }
};
export {
  Atom,
  EventEmitter,
  Host,
  PathMapper,
  Paths,
  SafeObject,
  arand,
  assign,
  create,
  createLogFactory,
  deepCopy,
  deepEqual2 as deepEqual,
  deepMerge,
  deepUndefinedToNull,
  entries,
  importantKinds,
  irand,
  key,
  keys,
  logKinds,
  logf2 as logf,
  makeId,
  map,
  mapBy,
  nob,
  prob,
  shallowMerge,
  shallowUpdate,
  values
};
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 * @module Decorator
 */
