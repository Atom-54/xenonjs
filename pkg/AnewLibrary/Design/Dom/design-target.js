/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../../Library/Dom/Xen/xen-async.js';

const log = logf("DOM:DesignTarget", 'orange', 'white');

const focusables = ['input', 'textarea', 'select', 'multi-select', 'tag-field'];

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
    this.addEventListener('scroll', e => this.onScroll(e), {capture: true});
    this.addEventListener('keydown', e => this.onKeyDown(e) /*, {capture: true}*/);
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
    this.key = elt?.atomId;
    this.fire('select');
  }
  onKeyDown(e) {
    this.key = this.state.selected?.atomId;
    if (this.key && !this.activeElementIsFocusable() && (e.key === 'Delete' || e.key === 'Backspace')) {
      this.fire('delete');
    }
  }
  activeElementIsFocusable() {
    return focusables.includes(document.activeElement?.shadowRoot?.activeElement?.localName);
  }
  doSelect(elt) {
    this.value = {};
    if (elt) {
      this.state.selected = elt;
      const rect = this.getLocalRect(elt);
      this.value.rects = [rect];
    }
    this.fire('selection-rects');
  }
  onPointermove(e) {
    let elt = e.ctrlKey ? this.findValidTarget(e.target) : null;
    this.state.over = elt;
    this.doOver(elt);
  };
  doOver(elt) {
    this.value = {};
    if (elt) {
      const rect = this.getLocalRect(elt);
      this.value.rects = [rect];
    }
    this.fire('over-rects');
  }
  onResize() {
    this.doSelect(this.state.selected);
    this.doOver(this.state.over);
    this.fire('resize');
  }
  onScroll() {
    this.doSelect(this.state.selected);
    this.doOver(this.state.over);
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
    while (elt) {
      elt = elt.closest('[atom]')
      if (elt.atomId.split('$').length > 3) {
        elt = elt.parentElement;
      } else  {
        return (!elt.atomId?.endsWith('Designable')) ? elt : null;
      }
    }
    return elt;
  };
};


const template = Xen.Template.html`
<slot></slot>
`;

customElements.define('design-target', DesignTarget);
