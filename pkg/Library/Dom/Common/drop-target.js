/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

Xen.DropTarget = class extends Xen.Async {
  enableDrop() {
    this.addEventListener('dragenter', e => this.onDragEnter(e));
    this.addEventListener('dragover', e => this.onDragOver(e));
    this.addEventListener('drop', e => this.onDrop(e));
  }
  onDragOver(e) {
    e.preventDefault();
  }
  onDragEnter(e) {
    e.preventDefault();
  }
  onDrop(e) {
    e.preventDefault();
    this.key = e.dataTransfer?.getData('text/plain');
    this.trigger = e;
    if (this.key) {
      this.fire('target-drop');
    }
  }
};

const template = Xen.Template.html`
<slot></slot>
`;

export class DropTarget extends Xen.DropTarget {
  static get observedAttributes() {
    return ['accepts'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.enableDrop();
  }
}
customElements.define('drop-target', DropTarget);
