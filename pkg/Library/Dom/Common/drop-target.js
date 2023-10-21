/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

Xen.DropTarget = class extends Xen.Async {
  _setValueFromAttribute(name, value) {
    if (name === 'disabled') {
      this[name] = value || (value === '');
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
    if (!this.disabled && this.contains(e.target)) {
      this.setAttribute('over', '');
      this.fireEvent(e, 'target-enter');
    }
  }
  onDragLeave(e) {
    e.preventDefault();
    if (!this.disabled && !this.contains(e.relatedTarget)) {
      this.removeAttribute('over');
      this.fireEvent(e, 'target-leave');
    }
  }
  onDrop(e) {
    e.preventDefault();
    if (!this.disabled) {
      this.fireEvent(e, 'target-drop');
      this.removeAttribute('over');
    }
  }
  fireEvent(e, name) {
    this.trigger = e;
    this.value = e.dataTransfer?.getData('text/plain');
    if (this.value) {
      this.fire(name);
    }
  }
};

const template = Xen.Template.html`
<slot></slot>
`;

export class DropTarget extends Xen.DropTarget {
  static get observedAttributes() {
    return ['accepts', 'disabled'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.enableDrop();
  }
}
customElements.define('drop-target', DropTarget);
