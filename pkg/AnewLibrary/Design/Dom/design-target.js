/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../../Library/Dom/Xen/xen-async.js';

const DesignTarget = class extends Xen.DropTarget {
  static get observedAttributes() {
    return ['accepts', 'disabled', 'datatype', 'targetkey'];
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
    //observer.observe(document.body);
  }
  getLocalRect(elt) {
    const frame = this.getBoundingClientRect();
    const rect = elt.getBoundingClientRect();
    rect.x -= frame.x;
    rect.y -= frame.y;
    return rect;
  }
  onClick(e) {
    let elt = findValidTarget(e.target);
    this.selected = elt;
    this.doSelect(elt);
  }
  doSelect(elt) {
    if (elt) {
      this.key = elt.id.replace(/_/g, '$');
      const rect = this.getLocalRect(elt);
      this.value = {rects: [rect]};
      this.fire('select');
    }
  }
  onPointermove(e) {
    let elt = findValidTarget(e.target);
    this.over = elt;
    this.doOver(elt);
  };
  doOver(elt) {
    let key = null;
    let value = null;
    if (elt) {
      key = elt.id.replace(/_/g, '$');
      const rect = this.getLocalRect(elt);
      value = {rects: [rect]};
    }
    this.value = value;
    if (elt) {
      this.fire('over');
    }
  }
  onResize() {
    this.doSelect(this.selected);
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
};

const findValidTarget = (elt) => {
  return elt.closest('[atom]');
};

const template = Xen.Template.html`
<slot></slot>
`;

customElements.define('design-target', DesignTarget);
