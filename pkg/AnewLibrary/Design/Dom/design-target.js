/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';

const log = logf("DOM:DesignTarget", 'orange', 'white');

const focusables = ['input', 'textarea', 'select', 'multi-select', 'tag-field', 'code-mirror'];

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
    this.observer = new ResizeObserver(() => this.onResize());
    this.observer.observe(this);
  }
  update({selected}, state) {
    const id = '#' + selected?.replace(/\$/g, '_');
    const elt = selected && this.domParent.querySelector(id);
    this.doSelect(elt);
  }
  get domParent() {
    return this.getRootNode().host;
  }
  doSelect(elt) {
    this.value = {};
    if (elt) {
      if (!this.state.selected || this.state.selected !== elt) {
        if (this.state.selected) {
          this.observer.unobserve(this.state.selected);
        }
        this.observer.observe(elt);
      }
      const rect = this.getLocalRect(elt);
      this.value.rects = [rect];
    }
    this.state.selected = elt;
    this.fire('selection-rects');
  }
  getLocalRect(elt) {
    const frame = this.getBoundingClientRect();
    const rect = elt.getBoundingClientRect();
    rect.x -= frame.x;
    rect.y -= frame.y;
    return rect;
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
  onClick(e) {
    let elt = this.findValidTarget(e.target, true);
    this.key = elt?.atomId;
    this.fire('select');
  }
  onPointermove(e) {
    let elt = e.ctrlKey ? this.findValidTarget(e.target, true) : null;
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
  doDragEnter(e) {
    const elt = this.findValidTarget(e.target);
    if (elt) {
      elt.style.outline = '5px dashed orange';
      elt.style.outlineOffset = '-2px';
    }
  }
  doDragLeave(e) {
    const elt = this.findValidTarget(e.target);
    if (elt) {
      elt.style.outline = null;
    }
  }
  doDragDrop(e) {
    const elt = this.findValidTarget(e.target);
    if (elt) {
      elt.style.outline = null;
      this.fireTargetEvent(e, elt, 'target-drop');
    }
  }
  findValidTarget(elt, noDesignable) {
    while (elt) {
      elt = elt.closest('[atom]')
      if (elt?.atomId.split('$').length > 3) {
        elt = elt.parentElement;
      } else {
        return (noDesignable && elt?.atomId?.endsWith('Designable')) ? null : elt;
      }
    }
    return elt;
  };
};

const template = Xen.Template.html`
<slot></slot>
`;

customElements.define('design-target', DesignTarget);
