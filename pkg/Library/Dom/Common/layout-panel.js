/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

export class LayoutPanel extends Xen.Async {
  onSlotChanged() {
    const children = this.firstElementChild?.assignedElements?.() ?? this.children;
    this.state = {children: [...children]};
    console.log(this.state);
  }
  get template() {
    return Xen.Template.html`
<slot on-slotchange="onSlotChange"></slot>
    `;
  }
}
customElements.define('layout-panel', LayoutPanel);
