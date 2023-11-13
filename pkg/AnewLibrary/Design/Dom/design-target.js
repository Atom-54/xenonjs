/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../../Library/Dom/Xen/xen-async.js';

const DesignTarget = class extends Xen.DropTarget {
  static get observedAttributes() {
    return ['accepts', 'disabled', 'datatype', 'targetkey', 'refresh', 'selected'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.enableDrop();
    this.addEventListener('click', e => this.onClick(e), {capture: true});
    this.addEventListener('pointermove', e => this.onPointermove(e), {capture: true});
    const observer = new ResizeObserver(() => this.onResize());
    observer.observe(this);
  }
  update({selected}, state) {
    const id = '#' + selected?.replace(/\$/g, '_');
    const elt = selected && this.domParent.querySelector(id);
    this.doSelect(elt);
  }
  get domParent() {
    return this.getRootNode().host;
  }
  getLocalRect(elt) {
    const frame = this.getBoundingClientRect();
    const rect = elt.getBoundingClientRect();
    rect.x -= frame.x;
    rect.y -= frame.y;
    return rect;
  }
  onClick(e) {
    let elt = this.findValidTarget(e.target);
    this.key = elt?.id.replace(/_/g, '$');
    this.fire('select');
  }
  doSelect(elt) {
    this.value = {};
    if (elt) {
      const rect = this.getLocalRect(elt);
      this.value.rects = [rect];
    }
    this.fire('selection-rects');
  }
  onPointermove(e) {
    let elt = e.ctrlKey ? this.findValidTarget(e.target) : null;
    this.over = elt;
    this.doOver(elt);
  };
  doOver(elt) {
    //let key = null;
    this.value = {};
    if (elt) {
      //key = elt.id.replace(/_/g, '$');
      const rect = this.getLocalRect(elt);
      this.value.rects = [rect];
    }
    this.fire('over-rects');
  }
  onResize() {
    this.doSelect(this.state.selected);
    this.doOver(this.over);
    this.fire('resize');
  }
  computeEventValue(e, name) {
    super.computeEventValue(e, name);
    if (!this.targetKey) {
      if (this.targetElt.shadowRoot.querySelector('[name^=Container]')) {
        this.key = this.targetElt.id + '#Container';
      }
    }
  }
  findValidTarget(elt) {
    return !elt.atomId?.endsWith('Designable') && elt.closest('[atom]') || null;
  };
};


const template = Xen.Template.html`
<slot></slot>
`;

customElements.define('design-target', DesignTarget);
