import {Xen} from '../../Dom/Xen/xen-async.js';
import './Spectrum.js';

export class SpectrumTabPanels extends Xen.Async {
  static get observedAttributes() {
    return ['tabs', 'selected'];
  }
  get template() {
    return Xen.html`
<style>
  sp-tabs, sp-tab-panel[selected] {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
  }
</style>
<template></template>
    `;
  }
  _didRender({tabs, selected}) {
    const html = [];
    html.push(`<sp-tabs selected="${selected || 0}">`)
    tabs?.forEach(tab => {
      html.push(`<sp-tab label="${tab.label}" value="${tab.value}"></sp-tab>`)
    });
    tabs?.forEach(panel => {
      html.push(Xen.html`
<sp-tab-panel value="${panel.value}">
  <slot name="Container${panel.value != "0" ? Number(panel.value) + 1 : ''}">
</sp-tab-panel>
      `)
    });
    html.push('</sp-tabs>')
    const template = this.shadowRoot.querySelector('template');
    template.innerHTML = html.join('');
    this.shadowRoot.querySelector('sp-tabs')?.remove();
    this.shadowRoot.appendChild(template.content);
  }
}
customElements.define('spectrum-tab-panels', SpectrumTabPanels);
