/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

const template = Xen.Template.html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    background-color: var(--theme-color-bg-2);
  }
</style>


<div repeat="section_t">{{sections}}</div>

<template section_t>
  <wl-expansion>
    <h3 slot="title">{{title}}</h3>
    <slot name="{{title}}"></slot>
  </wl-expansion>
</template>

`;

export class WeightlessAccordion extends Xen.Async {
  static get observedAttributes() {
    return ['sections'];
  }
  get template() {
    return template;
  }
  update({sections}, state) {
    state.sectionNames = sections?.split(',');
  }
  render({}, {sectionNames}) {
    return {
      sections: sectionNames?.map((section, i) => ({
        title: section
      }))
    };
  }
}

customElements.define('weightless-accordion', WeightlessAccordion);
