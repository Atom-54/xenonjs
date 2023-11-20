var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// js/core/EventEmitter.js
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

// js/utils/object.js
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
    Object.keys(data).forEach((key) => {
      result[key] = data[key];
      seen[key] = true;
    });
    Object.keys(result).forEach((key) => {
      if (!seen[key]) {
        delete result[key];
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
    Object.keys(data).forEach((key) => result[key] = data[key]);
    return result;
  }
  return data;
};
var deepMerge = (obj, data) => {
  if (data !== null) {
    if (typeof data === "object" && !Array.isArray(data)) {
      const result = obj && typeof obj === "object" ? obj : /* @__PURE__ */ Object.create(null);
      Object.keys(data).forEach((key) => result[key] = deepMerge(result[key], data[key]));
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
    const clone = {};
    Object.entries(datum).forEach(([key, value]) => {
      clone[key] = deepCopy(value);
    });
    return clone;
  } else {
    return datum;
  }
}
var deepEqual = (a, b) => {
  const type = typeof a;
  if (type !== typeof b) {
    return false;
  }
  if (type === "object" && a && b) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    return aProps.length == bProps.length && !aProps.some((name) => !deepEqual(a[name], b[name]));
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
var dirtyCheck = (state, data) => {
  const dirty = /* @__PURE__ */ Object.create(null);
  Object.entries(data).forEach(([key, value]) => {
    if (!deepEqual(value, state[key])) {
      dirty[key] = value;
    }
  });
  return dirty;
};

// js/utils/rand.js
var { floor, pow, random } = Math;
var irand = (range) => floor(random() * range);
var arand = (array) => array[irand(array.length)];

// js/core/Decorator.js
var { values, entries } = Object;
var opaqueData = {};
var log = logf("Decorator", "plum");
var Decorator = {
  setOpaqueData(name, data) {
    opaqueData[name] = data;
    return name;
  },
  getOpaqueData(name) {
    return opaqueData[name];
  },
  maybeDecorateModel(model, atom) {
    if (model && !Array.isArray(model)) {
      values(model).forEach((item) => {
        if (item && typeof item === "object") {
          if (item["models"]) {
            log("applying decorator(s) to list:", item);
            this.maybeDecorateItem(item, atom);
          } else {
            if (model?.filter || model?.decorator || model?.collateBy) {
              log("scanning for lists in sub-model:", item);
              this.maybeDecorateModel(item, atom);
            }
          }
        }
      });
    }
    return model;
  },
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
    log("decoration was performed");
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
  entries(item).forEach(([name, collator]) => {
    if (collator?.["collateBy"]) {
      const collation = collate(models, collator["collateBy"]);
      models = collationToRenderModels(collation, name, collator["$template"]);
    }
  });
  return models;
};
var sortByLc = (key) => (a, b) => sort(String(a[key]).toLowerCase(), String(b[key]).toLowerCase());
var sort = (a, b) => a < b ? -1 : a > b ? 1 : 0;
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
  return entries(collation).map(([key, models]) => ({
    key,
    [name]: { models, $template },
    single: !(models["length"] !== 1),
    ...models?.[0]
  }));
};

// js/core/Host.js
var { entries: entries2, keys } = Object;
var customLogFactory = (id) => logf(`Host (${id})`, arand(logColors));
var logColors = ["#5a189a", "#51168b", "#48137b", "#6b2fa4", "#7b46ae", "#3f116c"];
var Host = class extends EventEmitter {
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
    this.fire("eventlet", eventlet);
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
    return this.meta?.container || "root";
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
  rerender() {
    if (this.lastRenderModel) {
      this.render(this.lastRenderModel);
    }
  }
  render(model) {
    const { id, container, template } = this;
    const content = { model, template };
    const packet = { id, container, content };
    this.fire("render", packet);
    this.lastPacket = packet;
  }
  /**/
  set inputs(inputs) {
    if (this.atom && inputs) {
      let lastInputs = this.lastInputs ?? /* @__PURE__ */ Object.create(null);
      this.lastInputs = this.atom.inputs = deepCopy({ ...lastInputs, ...inputs });
    }
  }
  dirtyCheck(inputs, lastInputs, lastOutput) {
    const dirtyBits = ([n, v]) => (
      //lastOutput?.[n]  
      //? !deepEqual(lastOutput[n], v)
      //: 
      lastInputs?.[n] ? !deepEqual(lastInputs?.[n], v) : true
    );
    return entries2(inputs).some(dirtyBits);
  }
  lastInputsLength(lastInputs) {
    return keys(lastInputs).filter((key) => !this.meta?.staticInputs?.[key] && key !== "eventlet").length;
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
};

// js/utils/utils.js
var utils_exports = {};
__export(utils_exports, {
  PathMapper: () => PathMapper,
  Paths: () => Paths,
  deepCopy: () => deepCopy,
  deepEqual: () => deepEqual,
  deepMerge: () => deepMerge,
  deepUndefinedToNull: () => deepUndefinedToNull,
  dirtyCheck: () => dirtyCheck,
  makeId: () => makeId,
  shallowMerge: () => shallowMerge,
  shallowUpdate: () => shallowUpdate
});

// js/utils/id.js
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

// js/utils/paths.js
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

// src/xenon-atomic.js
var { Paths: Paths2 } = utils_exports;
export {
  EventEmitter,
  Host,
  Paths2 as Paths,
  utils_exports as utils
};
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
