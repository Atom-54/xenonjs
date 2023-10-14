/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

const template = Xen.Template.html`
<style>
  :host {
    display: block;
    cursor: grab;
    user-select: none;
  }
</style>
<slot></slot>
`;

export class Draggable extends Xen.Async {
  static get observedAttributes() {
    return ['key', 'effect', 'type'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.setAttribute('draggable', 'true');
    this.ondragstart = this.onDragStart.bind(this);
  }
  onDragStart(e) {
    e.dataTransfer.setData(this.type, this.key);
    e.dataTransfer.setData('text/plain', this.key);
    e.dataTransfer.effectAllowed = 'all';
    e.dataTransfer.dropEffect = this.effect;
  }
}

customElements.define('drag-able', Draggable);
