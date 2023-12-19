// xen-state.js
var nob = () => Object.create(null);
var debounce = (key, action, delay) => {
  if (key) {
    clearTimeout(key);
  }
  if (action && delay) {
    return setTimeout(action, delay);
  }
};
var XenStateMixin = (Base) => class extends (Base ?? class {
}) {
  constructor() {
    super();
    this._pendingProps = nob();
    this._props = this._getInitialProps() || nob();
    this._lastProps = nob();
    this._state = this._getInitialState() || nob();
    this._lastState = nob();
  }
  _getInitialProps() {
  }
  _getInitialState() {
  }
  _getProperty(name) {
    return this._pendingProps[name] || this._props[name];
  }
  _setProperty(name, value) {
    if (this._validator || this._wouldChangeProp(name, value)) {
      this._pendingProps[name] = value;
      this._invalidateProps();
    }
  }
  _wouldChangeValue(map, name, value) {
    return map[name] !== value;
  }
  _wouldChangeProp(name, value) {
    return this._wouldChangeValue(this._props, name, value);
  }
  _wouldChangeState(name, value) {
    return this._wouldChangeValue(this._state, name, value);
  }
  _setProps(props) {
    Object.assign(this._pendingProps, props);
    this._invalidateProps();
  }
  _invalidateProps() {
    this._propsInvalid = true;
    this._invalidate();
  }
  mergeState(object) {
    let dirty = false;
    const state = this._state;
    for (const property in object) {
      const value = object[property];
      if (this._wouldChangeState(property, value)) {
        dirty = true;
        state[property] = value;
      }
    }
    if (dirty) {
      this._invalidate();
      return true;
    }
  }
  _setState(object) {
    return this.mergeState(object);
  }
  _async(fn) {
    return Promise.resolve().then(fn.bind(this));
  }
  asyncTask(waitMs, fn) {
    return setTimeout(fn, Number(waitMs) || 0);
  }
  _invalidate() {
    if (!this._validator) {
      this._validator = this._async(this._validate);
    }
  }
  _getStateArgs() {
    return [this._props, this._state, this._lastProps, this._lastState];
  }
  _validate() {
    const stateArgs = this._getStateArgs();
    try {
      Object.assign(this._props, this._pendingProps);
      if (this._propsInvalid) {
        this._willReceiveProps(...stateArgs);
        this._propsInvalid = false;
      }
      if (this._shouldUpdate(...stateArgs)) {
        this._ensureMount();
        this._doUpdate(...stateArgs);
      }
    } catch (x) {
      console.error(x);
    }
    this._validator = null;
    this._lastProps = Object.assign(nob(), this._props);
    this._lastState = Object.assign(nob(), this._state);
  }
  _doUpdate(...stateArgs) {
    this._update(...stateArgs);
    this._didUpdate(...stateArgs);
  }
  _ensureMount() {
  }
  _willReceiveProps() {
  }
  _shouldUpdate() {
    return true;
  }
  _update() {
  }
  _didUpdate() {
  }
  _debounce(key, func, delay) {
    key = `_debounce_${key}`;
    this._state[key] = debounce(this._state[key], func, delay != null ? delay : 16);
  }
};
// xen-template.js
class Annotator {
  constructor(cb) {
    this.cb = cb;
  }
  annotate(node, notes, opts) {
    this.notes = notes;
    this.opts = opts || 0;
    this.key = this.opts.key || 0;
    notes.locator = this._annotateSubtree(node);
    return notes;
  }
  _annotateSubtree(node) {
    let childLocators;
    for (let i = 0, child = node.firstChild, previous = null, neo;child; i++) {
      const childLocator = this._annotateNode(child);
      if (childLocator) {
        (childLocators = childLocators || {})[i] = childLocator;
      }
      neo = previous ? previous.nextSibling : node.firstChild;
      if (neo === child) {
        previous = child;
        child = child.nextSibling;
      } else {
        child = neo;
        i--;
      }
    }
    return childLocators;
  }
  _annotateNode(node) {
    const key = this.key++;
    const shouldLocate = this.cb(node, key, this.notes, this.opts);
    const locators = this._annotateSubtree(node);
    if (shouldLocate || locators) {
      const cl = Object.create(null);
      cl.key = key;
      if (locators) {
        cl.sub = locators;
      }
      return cl;
    }
  }
}
var locateNodes = function(root, locator, map) {
  map = map || [];
  for (const n in locator) {
    const loc = locator[n];
    if (loc) {
      const node = root.childNodes[n];
      map[loc.key] = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
      if (loc.sub) {
        locateNodes(node, loc.sub, map);
      }
    }
  }
  return map;
};
var annotatorImpl = function(node, key, notes, opts) {
  let tracking = false;
  if (opts.annotator && opts.annotator(node, key, notes, opts)) {
    tracking = true;
  }
  switch (node.nodeType) {
    case Node.DOCUMENT_FRAGMENT_NODE:
      break;
    case Node.ELEMENT_NODE:
      return tracking || annotateElementNode(node, key, notes);
    case Node.TEXT_NODE:
      return tracking || annotateTextNode(node, key, notes);
  }
  return tracking;
};
var annotateTextNode = function(node, key, notes) {
  if (annotateMustache(node, key, notes, "textContent", node.textContent)) {
    node.textContent = "";
    return true;
  }
};
var annotateElementNode = function(node, key, notes) {
  if (node.hasAttributes()) {
    let noted = false;
    for (let a$ = node.attributes, i = a$.length - 1, a;i >= 0 && (a = a$[i]); i--) {
      if (annotateEvent(node, key, notes, a.name, a.value) || annotateMustache(node, key, notes, a.name, a.value) || annotateDirective(node, key, notes, a.name, a.value)) {
        node.removeAttribute(a.name);
        noted = true;
      }
    }
    return noted;
  }
};
var annotateMustache = function(node, key, notes, property, mustache) {
  if (mustache.slice(0, 2) === "{{") {
    if (property === "class") {
      property = "className";
    }
    let value = mustache.slice(2, -2);
    const delim = mustache.includes("=") ? "=" : ":";
    const override = value.split(delim);
    if (override.length === 2) {
      property = override[0];
      value = override[1];
    }
    takeNote(notes, key, "mustaches", property, value);
    if (value[0] === "$") {
      takeNote(notes, "xlate", value, true);
    }
    return true;
  }
};
var annotateEvent = function(node, key, notes, name, value) {
  if (name.slice(0, 3) === "on-") {
    if (value.slice(0, 2) === "{{") {
      value = value.slice(2, -2);
      console.warn(`Xen: event handler for '${name}' expressed as a mustache, which is not supported. Using literal value '${value}' instead.`);
    }
    takeNote(notes, key, "events", name.slice(3), value);
    return true;
  }
};
var annotateDirective = function(node, key, notes, name, value) {
  if (name === "xen:forward") {
    takeNote(notes, key, "events", "xen:forward", value);
    return true;
  }
};
var takeNote = function(notes, key, group, name, note) {
  const n$ = notes[key] || (notes[key] = Object.create(null));
  (n$[group] || (n$[group] = {}))[name] = note;
};
var annotator = new Annotator(annotatorImpl);
var annotate = function(root, key, opts) {
  return root._notes || (root._notes = annotator.annotate(root.content, {}, key, opts));
};
var mapEvents = function(notes, map, mapper) {
  for (const key in notes) {
    const node = map[key];
    const events = notes[key] && notes[key].events;
    if (node && events) {
      for (const event in events) {
        let name = event;
        let value = events[name];
        if (value.includes("=")) {
          [name, value] = value.split("=");
        }
        mapper(node, name, value);
      }
    }
  }
};
var listen = function(controller, node, eventName, handlerName) {
  node.addEventListener(eventName, function(e) {
    if (controller[handlerName]) {
      return controller[handlerName](e, e.detail);
    } else if (controller.defaultHandler) {
      return controller.defaultHandler(handlerName, e);
    }
  });
};
var set = function(notes, map, scope, controller) {
  if (scope) {
    for (const key in notes) {
      const node = map[key];
      if (node) {
        node.scope = scope;
        const mustaches = notes[key].mustaches;
        for (const name in mustaches) {
          const property = mustaches[name];
          if (property in scope) {
            _set(node, name, scope[property], controller);
          }
        }
      }
    }
  }
};
var _set = function(node, property, value, controller) {
  const modifier = property.slice(-1);
  if (property === "style%" || property === "style" || property === "xen:style") {
    if (typeof value === "string") {
      node.style.cssText = value;
    } else {
      Object.assign(node.style, value);
    }
  } else if (modifier == "$") {
    const n = property.slice(0, -1);
    if (typeof value === "boolean" || value === undefined || value === null) {
      setBoolAttribute(node, n, Boolean(value));
    } else {
      node.setAttribute(n, value);
    }
  } else if (property === "textContent") {
    if (value?.$template || value?.template || Array.isArray(value) || value?.models) {
      _setSubTemplate(node, value, controller);
    } else {
      const isPrimitiveValue = value !== null && value !== undefined && typeof value !== "object" && typeof value !== "function";
      node.textContent = isPrimitiveValue ? value : "";
    }
  } else if (property === "unsafe-html") {
    node.innerHTML = value || "";
  } else if (property === "value") {
    if (node.value !== value) {
      node.value = value;
    }
  } else if (property === "focus" && node.focus) {
    node.focus();
  } else if (property === "src") {
    const src = value || "";
    if (node._src !== src) {
      node._src = src;
      node.src = src;
    }
  } else {
    node[property] = value;
  }
};
var setBoolAttribute = function(node, attr, state) {
  node[(state === undefined ? !node.hasAttribute(attr) : state) ? "setAttribute" : "removeAttribute"](attr, "");
};
var _setSubTemplate = function(node, value, controller) {
  let { template, $template: templateName, models } = value;
  if (Array.isArray(value)) {
    models = value;
  }
  if (!template) {
    const name = templateName || node?.getAttribute("repeat");
    template = node.getRootNode().querySelector(`template[${name}]`);
  } else {
    template = maybeStringToTemplate(template);
  }
  _renderSubtemplates(node, controller, template, models);
};
var _renderSubtemplates = function(container, controller, template, models) {
  const temp = stamp(template);
  const eltCount = temp.root.childElementCount;
  console.warn(eltCount);
  const {children} = container;
  let index = 0;
  let child = container.firstElementChild;
  let next;
  if (template && models) {
    models && models.forEach((model, i) => {
      index += eltCount;
      next = children[index];
      //next = child && child.nextElementSibling;
      if (!child) {
        const dom = stamp(template).events(controller);
        child = dom.root.firstElementChild;
        if (child) {
          child._subtreeDom = dom;
          container.appendChild(child);
          if (!template._shapeWarning && dom.root.firstElementChild) {
            template._shapeWarning = true;
            console.warn(`xen-template: subtemplate has multiple root nodes: only the first is used.`, template);
          }
        }
      }
      if (child) {
        child._subtreeDom.set(model);
        child = next;
      }
    });
  }
  while (child) {
    next = child.nextElementSibling;
    child.remove();
    child = next;
  }
};
var stamp = function(template, opts) {
  template = maybeStringToTemplate(template);
  const notes = annotate(template, opts);
  const root = document.importNode(template.content, true);
  const firstElement = root.firstElementChild;
  const map = locateNodes(root, notes.locator);
  const dom = {
    root,
    notes,
    map,
    firstElement,
    $(slctr) {
      return this.root.querySelector(slctr);
    },
    $$(slctr) {
      return this.root.querySelectorAll(slctr);
    },
    set: function(scope) {
      scope && set(notes, map, scope, this.controller);
      return this;
    },
    events: function(controller) {
      if (controller && typeof controller !== "function") {
        controller = listen.bind(this, controller);
      }
      this.controller = controller;
      if (controller) {
        mapEvents(notes, map, controller);
      }
      return this;
    },
    forward: function() {
      mapEvents(notes, map, (node, eventName, handlerName) => {
        node.addEventListener(eventName, (e) => {
          const wrapper = { eventName, handlerName, detail: e.detail, target: e.target };
          fire(node, "xen:forward", wrapper, { bubbles: true });
        });
      });
      return this;
    },
    appendTo: function(node) {
      if (this.root) {
        node.appendChild(this.root);
      } else {
        console.warn("Xen: cannot appendTo, template stamped no DOM");
      }
      this.root = node;
      return this;
    }
  };
  return dom;
};
var fire = (node, eventName, detail, init) => {
  const eventInit = init || {};
  eventInit.detail = detail;
  const event = new CustomEvent(eventName, eventInit);
  node.dispatchEvent(event);
  return event.detail;
};
var maybeStringToTemplate = (template) => {
  return typeof template === "string" ? createTemplate(template) : template;
};
var createTemplate = (innerHTML) => {
  return Object.assign(document.createElement("template"), { innerHTML });
};
var Template = {
  createTemplate,
  setBoolAttribute,
  stamp,
  takeNote
};
// xen-element.js
var XenElementMixin = (Base) => class extends Base {
  constructor() {
    super();
    this._mounted = false;
    this._root = this;
    this.__configureAccessors();
    this.__lazyAcquireProps();
  }
  get _class() {
    return this.constructor._class || this.constructor;
  }
  __configureAccessors() {
    const p = Object.getPrototypeOf(this);
    if (!p.hasOwnProperty("__$xenPropsConfigured")) {
      p.__$xenPropsConfigured = true;
      const a = this._class.observedAttributes;
      a && a.forEach((n) => {
        Object.defineProperty(p, n, {
          get() {
            return this._getProperty(n);
          },
          set(value) {
            this._setProperty(n, value);
          }
        });
      });
    }
  }
  __lazyAcquireProps() {
    const a = this._class.observedAttributes;
    a && a.forEach((n) => {
      if (n.toLowerCase() !== n) {
        console.error(`Xen: Mixed-case attributes are not yet supported, "${this.localName}.observedAttributes" contains "${n}".`);
      }
      if (this.hasOwnProperty(n)) {
        const value = this[n];
        delete this[n];
        this[n] = value;
      } else if (this.hasAttribute(n)) {
        this._setValueFromAttribute(n, this.getAttribute(n));
      }
    });
  }
  _setValueFromAttribute(name, value) {
    this[name] = value;
  }
  connectedCallback() {
    this._mount();
  }
  _mount() {
    if (!this._mounted) {
      this._mounted = true;
      this._doMount();
      this._didMount();
    }
  }
  _doMount() {
  }
  _didMount() {
  }
  _fire(eventName, detail, node, init) {
    const eventInit = init || {};
    eventInit.detail = detail;
    const event = new CustomEvent(eventName, eventInit);
    (node || this).dispatchEvent(event);
    return event.detail;
  }
};
// xen-base.js
var { HTMLElement } = globalThis;
var XenBaseMixin = (Base) => class extends Base {
  get template() {
    const module = this.constructor.module;
    return module ? module.querySelector("template") : "";
  }
  get host() {
    return this.shadowRoot || this.attachShadow({ mode: `open` });
  }
  _doMount() {
    this._stamp();
    this._invalidate();
  }
  _stamp() {
    if (this.template) {
      this._dom = Template.stamp(this.template).events(this._listener.bind(this)).appendTo(this.host);
    }
  }
  _listener(node, name, handler) {
    node.addEventListener(name, (e) => {
      if (this[handler]) {
        return this[handler](e, e.detail, this._props, this._state);
      }
    });
  }
  _doUpdate(...stateArgs) {
    this._update(...stateArgs);
    let model = this._render(...stateArgs);
    if (this._dom) {
      if (Array.isArray(model)) {
        model = model.reduce((sum, value) => Object.assign(sum, value), Object.create(null));
      }
      this._dom.set(model);
    }
    this._didUpdate(...stateArgs);
    this._didRender(...stateArgs);
  }
  _render() {
  }
  _didRender() {
  }
};
var XenBase = XenBaseMixin(XenElementMixin(XenStateMixin(HTMLElement)));
// xen-debug.js
var Debug = (Base, log) => class extends Base {
  _setProperty(name, value) {
    if (Debug.level > 1) {
      if ((name in this._pendingProps) && this._pendingProps[name] !== value || this._props[name] !== value) {
        log("props", deepishClone({ [name]: value }));
      }
    }
    return super._setProperty(name, value);
  }
  _setState(state) {
    if (typeof state !== "object") {
      console.warn(`Xen::_setState argument must be an object`);
      return false;
    }
    if (super._setState(state)) {
      if (Debug.level > 1) {
        if (Debug.lastFire) {
          log("(fired -->) state", deepishClone(state));
        } else {
          log("state", deepishClone(state));
        }
      }
      return true;
    }
  }
  _setImmutableState(name, value) {
    log("state [immutable]", { [name]: value });
    super._setImmutableState(name, value);
  }
  _fire(name, detail, node, init) {
    Debug.lastFire = { name, detail: deepishClone(detail), log };
    log("fire", { [Debug.lastFire.name]: Debug.lastFire.detail });
    super._fire(name, detail, node, init);
    Debug.lastFire = null;
  }
  _doUpdate(...args) {
    if (Debug.level > 2) {
      log("updating...");
    }
    return super._doUpdate(...args);
  }
  _invalidate() {
    if (Debug.level > 2) {
      if (!this._validator) {
        log("invalidating...");
      }
    }
    super._invalidate();
  }
};
var deepishClone = (obj, depth) => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  const clone = Object.create(null);
  for (const n in obj) {
    let value = obj[n];
    if (depth < 1) {
      value = deepishClone(obj, (depth || 0) + 1);
    }
    clone[n] = value;
  }
  return clone;
};
Debug.level = 0;
var _logFactory = (preamble, color, log = "log") => console[log].bind(console, `%c${preamble}`, `background: ${color}; color: white; padding: 1px 6px 2px 7px; border-radius: 6px;`);
var logFactory = (preamble, color, log) => Debug.level > 0 ? _logFactory(preamble, color, log) : () => {
};
var walker = (node, tree) => {
  let subtree = tree;
  if (!subtree) {
    subtree = {};
  }
  const root = node || document.body;
  let index = 1;
  let child = root.firstElementChild;
  while (child) {
    const name = child.localName;
    const clas = customElements.get(name);
    if (clas) {
      const shadow = child.shadowRoot;
      const record = {
        node: child,
        props: child._props,
        state: child._state
      };
      const children = shadow ? walker(shadow) : {};
      if (children) {
        record.children = children;
      }
      let moniker = `${name}${child.id ? `#${child.id}` : ``} (${index++})`;
      while (subtree[moniker]) {
        moniker += "_";
      }
      subtree[moniker] = record;
    }
    walker(child, subtree);
    child = child.nextElementSibling;
  }
  return subtree;
};

// xen.js
var html = (strings, ...values) => {
  return (strings[0] + values.map((v, i) => v + strings[i + 1]).join("")).trim();
};
Template.html = (...args) => Template.createTemplate(html(...args));
var clone = (obj) => typeof obj === "object" ? Object.assign(Object.create(null), obj) : {};
var Xen = {
  State: XenStateMixin,
  Template,
  Element: XenElementMixin,
  BaseMixin: XenBaseMixin,
  Base: XenBase,
  Debug,
  setBoolAttribute: Template.setBoolAttribute,
  html,
  walker,
  logFactory,
  clone,
  nob,
  debounce
};
globalThis.Xen = Xen;
var xen_default = Xen;
// xen-async.js
var XenAsyncMixin = (Base) => class extends Base {
  set state(state) {
    this._setState(state);
  }
  get state() {
    return this._state;
  }
  get props() {
    return this._props;
  }
  async(fn) {
    return this._async(fn);
  }
  invalidate(fn) {
    return this._invalidate(fn);
  }
  async awaitState(name, operation) {
    const state = this._state;
    const semaphore = `_await_${name}`;
    if (!state[semaphore]) {
      state[semaphore] = true;
      const value = await operation();
      this.state = { [name]: value, [semaphore]: false };
    }
  }
  fire(...args) {
    return this._fire(...args);
  }
  _getInitialState() {
    return this.getInitialState && this.getInitialState();
  }
  _update(props, state, oldProps, oldState) {
    return this.update && this.update(props, state, oldProps, oldState);
  }
  _render(props, state, oldProps, oldState) {
    if (this.shouldRender(props, state, oldProps, oldState)) {
      return this.render && this.render(props, state, oldProps, oldState);
    }
  }
  shouldRender() {
    return true;
  }
  render(props, state) {
    return state;
  }
  onState(e, data) {
    this._setState({ [e.type]: data });
  }
};
xen_default.AsyncMixin = XenAsyncMixin;
xen_default.Async = XenAsyncMixin(xen_default.Base);
export {
  nob,
  debounce,
  XenStateMixin,
  XenElementMixin,
  XenBaseMixin,
  XenBase,
  XenAsyncMixin,
  xen_default as Xen,
  Template
};

//# debugId=479A08DA00D2736D64756e2164756e21
