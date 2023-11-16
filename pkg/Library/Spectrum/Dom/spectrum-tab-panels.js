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
<sp-tabs-overflow></sp-tabs-overflow>
    `;
  }
  _didRender({tabs, selected}) {
    const html = [];
    html.push(`
<sp-tabs selected="${selected || 0}">`)
    tabs?.forEach(tab => {
      html.push(Xen.html`
<sp-tab Xlabel="${tab.label}" value="${tab.value}"><icon>close</icon>&nbsp;${tab.label}</sp-tab>
      `)
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
    const parent = this.shadowRoot.querySelector('sp-tabs-overflow');
    parent.innerHTML = '';
    parent.appendChild(template.content);
  }
}
customElements.define('spectrum-tab-panels', SpectrumTabPanels);
