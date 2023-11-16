/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../../Library/Dom/Xen/xen-async.js';
import {IconsCss} from '../../../Library/Dom/Material/material-icon-font/icons.css.js';
import {deepEqual} from '../../Xenon/Atomic/js/utils/object.js';

import './Spectrum.js';

const template = Xen.Template.html`
<style>
  ${IconsCss}
  icon {
    font-size: 12px;
    padding: 4px 0 2px 2px;
    border-radius: 100%;
    font-weight: bold;
    margin: 0 0 0 2px;
    visibility: hidden;
  }
  sp-tab {
    margin-inline-start: 8px;
    margin-inline-end: 8px;
  }
  sp-tab:hover icon {
    visibility: visible;
  }
  sp-tab[selected] icon {
    visibility: visible;
  }
  sp-tabs, sp-tab-panel[selected] {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
  }
  [row] {
    display: flex;
    align-items: center;
  }
</style>
<template></template>
<!-- content -->
<slot on-slotchange="onSlotChange"></slot>
`;

export class SpectrumTabPanels extends Xen.Async {
  static get observedAttributes() {
    return ['tabs', 'selected', 'closeable'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.addEventListener('click', e => this.onClick(e));
  }
  update({tabs}, state) {
    state.renderTabs = !deepEqual(state.tabs, tabs);
    state.tabs = tabs;
    this.childrenChanged();
  }
  render({tabs, closeable}) {
    return {
      tabs: tabs?.map(({label, value}) => ({
        value,
        label,
        closeable
      })),
    };
  }
  // sp-tabs do not work when rendered dynamically, 
  // so we resort to HTML construction
  _didRender({tabs, selected, closeable}, {children, renderTabs}) {
    if (renderTabs) {
      const html = [];
      html.push(Xen.html`
<sp-tabs-overflow>    
  <sp-tabs selected="${selected || 0}">
      `);
      tabs?.forEach(tab => {
        html.push(Xen.html`
    <sp-tab value="${tab.value}">
      <span row>${tab.label}${closeable ? `<icon value="${tab.value}">close</icon>` : ''}<span>
    </sp-tab>
        `)
      });
      html.push(Xen.html`
  </sp-tabs>
</sp-tabs-overflow>
      `);
      const template = this.shadowRoot.querySelector('template');
      template.innerHTML = html.join('');
      this.shadowRoot.querySelector('sp-tabs-overflow')?.remove();
      const slot = this.shadowRoot.querySelector('slot');
      this.shadowRoot.insertBefore(template.content, slot);
      this.shadowRoot.querySelector('sp-tabs').addEventListener('change', e => this.onChange(e));
    }
    // show selected panel
    children.sort((a, b) => (Number(a?.style?.order) || 0) - (Number(b?.style?.order) || 0));
    children?.forEach((c, i) => c.style.display = (i === selected) ? null : 'none');
  }
  onChange(e) {
    this.value = Number(e.currentTarget.selected);
    this.fire('change');
  }
  onClick(e) {
    const target = e.composedPath()[0];
    if (target.localName === 'icon') {
      this.value = target.getAttribute('value');
      console.warn('close', this.value);
      this.fire('close');
    }
  }
  onSlotChange(e) {
    this.childrenChanged();
  }
  childrenChanged() {
    const children = [...this._dom.$('slot').assignedElements({flatten: true})];
    this.state = {children};
  }  
}

customElements.define('spectrum-tab-panels', SpectrumTabPanels);
