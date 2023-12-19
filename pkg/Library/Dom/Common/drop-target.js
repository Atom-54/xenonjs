/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

Xen.DropTarget = class extends Xen.Async {
  _setValueFromAttribute(attr, value) {
    if (attr === 'disabled') {
      this[attr] = value || (value === '');
    } else {
      super._setValueFromAttribute(attr, value);
    }
  }
  enableDrop() {
    this.addEventListener('dragenter', e => this.onDragEnter(e));
    this.addEventListener('dragleave', e => this.onDragLeave(e));
    this.addEventListener('dragover', e => this.onDragOver(e));
    this.addEventListener('drop', e => this.onDrop(e));
  }
  onDragOver(e) {
    e.preventDefault();
  }
  onDragEnter(e) {
    e.preventDefault();
    if (this.isValidTarget(e)) { 
      this.setAttribute('over', '');
      this.doDragEnter?.(e); 
    }
  }
  onDragLeave(e) {
    e.preventDefault();
    if (this.isValidTarget(e)) {
      this.removeAttribute('over');
      this.doDragLeave?.(e); 
    }
  }
  onDrop(e) {
    e.preventDefault();
    if (this.isValidTarget(e)) {
      this.removeAttribute('over');
      this.doDragDrop?.(e); 
    }
  }
  isValidTarget(e) {
    return (!this.disabled && e.composedPath().includes(this));
  }
  fireTargetEvent(e, elt, name) {
    this.computeEventValue(e, elt);
    this.fire(name);
  }
  computeEventValue(e, t) {
    this.trigger = e;
    while (t && !t.id) t = t.closest('[id]') ?? t.getRootNode().host;
    this.targetElt = t;
    this.key = this.targetkey || t?.id;
    this.value = (this.datatype && e.dataTransfer?.getData(this.datatype)) || e.dataTransfer.getData('text/plain');
  }
};

const template = Xen.Template.html`
<slot></slot>
`;

export class DropTarget extends Xen.DropTarget {
  static get observedAttributes() {
    return ['accepts', 'disabled', 'datatype', 'targetkey'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.enableDrop();
  }
  doDragOver(e) {
    this.fireTargetEvent(e, e.target, 'target-over');
  }
  doDragEnter(e) {
    this.fireTargetEvent(e, e.target, 'target-enter');
  }
  doDragLeave(e) {
    this.fireTargetEvent(e, e.target, 'target-leave');
  }
  doDragDrop(e) {
    this.fireTargetEvent(e, e.target, 'target-drop');
  }
}
customElements.define('drop-target', DropTarget);
