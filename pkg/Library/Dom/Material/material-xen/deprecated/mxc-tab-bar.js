/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Xen/xen-async.js';

/**
 * Wraps MWC-TAB-BAR to implement `value` property
 */

const template = Xen.Template.html`
<mwc-tab-bar activeindex="{{activeIndex:selected}}" files on-change="MDCTabBar:activated=onTabActivated">
  <slot></slot>
</mwc-tab-bar>
`;

export class MxcTabBar extends Xen.Async {
  static get observedAttributes() {
    return ['selected'];
  }
  get template() {
    return template;
  }
  onTabActivated(e) {
    this.key = e.detail.index;
    this.fire('selected');
  }
  render(inputs) {
    return inputs;
  }
}
