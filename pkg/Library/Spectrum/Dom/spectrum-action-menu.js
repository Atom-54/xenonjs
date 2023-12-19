/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {IconsCss} from '../../Dom/Material/material-icon-font/icons.css.js';

import './Spectrum.js';

export class SpectrumActionMenu extends Xen.Async {
  static get observedAttributes() {
    return [];
  }
  // _didMount() {
  //   this.addEventListener('click', e => this.onClick(e));
  // }
  // update({tabs}, state) {
  //   state.renderTabs = !deepEqual(state.tabs, tabs);
  //   state.tabs = tabs ? [...tabs] : tabs;
  //   this.childrenChanged();
  // }
  // render({tabs, closeable}) {
  //   return {
  //     tabs: tabs?.map(({label, value}) => ({
  //       value,
  //       label,
  //       closeable
  //     })),
  //   };
  // }
  // onSlotChange(e) {
  //   this.childrenChanged();
  // }
  // childrenChanged() {
  //   const children = [...this._dom.$('slot').assignedElements({flatten: true})];
  //   this.state = {children};
  // }  
  get template() {
    return Xen.Template.html`
<style>${IconsCss}</style>
<sp-button id="menu">Options</sp-button>
<sp-overlay trigger="menu@click" placement="bottom">
  <sp-popover open style="position: relative">
    <sp-menu selects="single">
      <sp-menu-item>
          Deselect
      </sp-menu-item>
      <sp-menu-item>
          Select inverse
      </sp-menu-item>
      <sp-menu-item>
          Feather...
      </sp-menu-item>
      <sp-menu-item>
          Select and mask...
      </sp-menu-item>
      <sp-menu-item>
          Save selection
      </sp-menu-item>
      <sp-menu-item disabled>
          Make work path
      </sp-menu-item>
    </sp-menu>
  </sp-popover>
</sp-overlay>
    `
  }
}

customElements.define('spectrum-action-menu', SpectrumActionMenu);