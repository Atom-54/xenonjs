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
    if (this.isValidTarget(e)) { //this.contains(e.target)) {
      this.setAttribute('over', '');
      this.fireEvent(e, 'target-enter');
    }
  }
  onDragLeave(e) {
    e.preventDefault();
    if (this.isValidTarget(e)) {
      this.removeAttribute('over');
      this.fireEvent(e, 'target-leave');
    }
  }
  onDrop(e) {
    e.preventDefault();
    if (this.isValidTarget(e)) {
      this.fireEvent(e, 'target-drop');
      this.removeAttribute('over');
    }
  }
  isValidTarget(e) {
    return (!this.disabled && e.composedPath().includes(this));
  }
  fireEvent(e, name) {
    let t = e.target;
    while (t && !t.id) t = t.closest('[id]') ?? t.getRootNode().host;
    const path = e.composedPath();
    let i = path.indexOf(t) - 1;
    while (i >= 0 && path[i].localName !== 'slot') i--;
    if (i >= 0) {
      log.debug('container: ', path[i].getAttribute('name'));
    }
    this.key = this.targetkey || t?.id;
    this.trigger = e;
    this.value = e.dataTransfer?.getData(this.datatype || 'text/plain');
    this.fire(name);
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
}
customElements.define('drop-target', DropTarget);
