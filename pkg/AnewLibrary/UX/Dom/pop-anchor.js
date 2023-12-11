/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';

export class PopAnchor extends Xen.Async {
  _didMount() {
    const anchorClick = e => {
      e.stopPropagation();
      this.value = {x: e.x, y: e.y}
      this.fire('anchor');
    };
    this.addEventListener('click', anchorClick);
  }
  get template() {
    return Xen.Template.html`
<style>
  :host {
    display: inline-block;
    cursor: pointer;
    user-select: none;
  }
</style>
<slot></slot>
  `;
  }
}

customElements.define('pop-anchor', PopAnchor);