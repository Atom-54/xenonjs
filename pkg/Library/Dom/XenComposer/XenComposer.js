/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import '../../CoreXenon/Reactor/Atomic/js/logf.js';
import {Composer} from '../../CoreXenon/Reactor/Atomic/js/core/Composer.js';
import {Xen} from '../Xen/xen-async.js';
import {IconsCss} from '../Material/material-icon-font/icons.css.js';
import {XenCss} from '../Material/material-xen/xen.css.js';
import {dom} from '../dom.js';

//const log = logFactory(logFactory.flags.composer, 'composer', 'red');

const sanitizeId = id => id.replace(/[$)(:]/g, '_');

export class XenComposer extends Composer {
  constructor(root, useShadowRoot, onevent) {
    super();
    this.root = root;
    this.useShadowRoot = useShadowRoot;
    this.onevent = onevent;
  }
  setRoot(root) {
    this.root = root;
    this.processPendingPackets();
  }
  findContainer(container) {
    let node = this.root;
    if (container?.[0] === '#') {
      node = deepQuerySelector(document.body, container);
    } else if (container && container !== 'root') {
      const [particle, slot] = container.split('#');
      const owner = deepQuerySelector(node, `#${sanitizeId(particle)}`);
      node = owner;
    }
    return node;
  }
  generateSlot(id, containerName, template, parent) {
    if (!parent) {
      throw Error('Cannot generateSlot without a parent node');
    }
    const sid = sanitizeId(id);
    //const tag = sanitizeId(id.split(':').pop().match(/[\D]*/).pop().split('$').pop().toLowerCase());
    const tag = sanitizeId(id.split('$').pop().toLowerCase());
    const container = dom(`${tag}-atom`, {
      atomId: id,
      id: sid,
      slot: containerName?.split('#').pop()
    }, parent);
    container.setAttribute('atom', '');
    // TODO(sjmiles): hack is for a_frame elements that cannot live in ShadowDOM
    const root = (!id.toLowerCase().startsWith('a_') && this.useShadowRoot) ? container.attachShadow({mode: `open`}) : container;
    const css = `/*injected by XenComposer*/${IconsCss}${XenCss}`;
    dom('style', {innerHTML: css}, root);
    const slot = Xen.Template
      .stamp(template)
      .appendTo(root)
      .events(this.mapEvent.bind(this, id))
    ;
    return slot;
  }
  maybeReattachSlot(slot, container) {
    if (!slot.root.isConnected) {
      const parent = this.findContainer(container);
      parent?.appendChild(slot.root.host);
    }
  }
  clearSlot(slot) {
    slot.root.host.remove();
  }
  mapEvent(pid, node, type, handler) {
    node.addEventListener(type, e => {
      // TODO(sjmiles): just added this 6/2020 for no bubbling; would have sworn there was already no bubbling
      e.stopPropagation();
      //e.preventDefault();
      const data = {key: null, value: null};
      // walk up the event path to find the topmost key/value data
      const branch = e.composedPath();
      let elt;
      for (elt of branch) {
        if (elt.nodeType === Node.ELEMENT_NODE) {
          if ('key' in elt) {
            data.key = elt.key;
          } else if (elt.hasAttribute('key')) {
            data.key = elt.getAttribute('key');
          }
          if (elt.value !== undefined) {
            data.value = elt.value;
          } else if ('checked' in elt && elt.checked !== undefined) {
            data.value = elt.checked;
          } else if ('value' in elt) {
            data.value = elt.value;
          } else if (elt.hasAttribute('value')) {
            data.value = elt.getAttribute('value');
          } else if ('selected' in elt) {
            data.value = elt.selected;
          }
        }
        if (e.currentTarget === elt || data.key || data.value) {
          break;
        }
      }
      if (e.currentTarget && (e instanceof WheelEvent)) {
        const {deltaX, deltaY, deltaZ, deltaMode} = e;
        const {scrollTop, scrollLeft} = e.currentTarget;
        Object.assign(data, {deltaX, deltaY, deltaZ, deltaMode, scrollTop, scrollLeft});
      }
      const eventlet = {name: type, handler, data};
      this.onevent(pid, eventlet);
    });
  }
  requestFontFamily(fontFamily) {
    const props = {
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${fontFamily}&display=swap`
    };
    dom('link', props, document.head);
    return true;
  }
}

// move to dom.js?
const deepQuerySelector = (root, selector) => {
  const find = (element, selector) => {
    let result;
    while (element && !result) {
      result =
          (element.matches && element.matches(selector) ? element : null)
          || find(element.firstElementChild, selector)
          || (element.shadowRoot && find(element.shadowRoot.firstElementChild, selector))
          ;
      element = element.nextElementSibling;
    }
    return result;
  };
  return find(root || document.body, selector);
};
