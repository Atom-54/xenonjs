/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';

export class ContextMenuAnchor extends Xen.Async {
  _didMount() {
    const anchorClick = e => {
      e.stopPropagation();
      e.preventDefault();
      this.value = {x: e.x, y: e.y}
      this.fire('anchor');
    };
    this.addEventListener('contextmenu', anchorClick);
  }
  get template() {
    return Xen.Template.html`<slot></slot>`;
  }
}

customElements.define('context-menu-anchor', ContextMenuAnchor);