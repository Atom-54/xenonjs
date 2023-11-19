/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Xen/xen-async.js';

const template = Xen.Template.html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    background-color: var(--theme-color-bg-2);
  }
</style>

<!-- tabs -->
<mwc-tab-bar activeindex="{{activeIndex:selected}}" on-change="MDCTabBar:activated=onTabActivated">{{tabs}}</mwc-tab-bar>

<!-- content -->
<slot on-slotchange="onSlotChange"></slot>

<template tabT>
  <mwc-tab label="{{label}}" active="{{active}}"></mwc-tab>
</template>
`;

export class MxcTabPages extends Xen.Async {
  static get observedAttributes() {
    return ['tabs', 'selected', 'disabletabs'];
  }
  get template() {
    return template;
  }
  _didMount() {
    //console.log('MxcTabPages rendered.');
    // const slot = this.querySelector('slot');
    // if (slot) {
    //   console.log('I have this slot in my light dom:', slot);
    //   console.log('<slot> has these assignedElements:', slot.assignedElements());
    // }
    this.commandeerTabControl();
    this.childrenChanged();
  }
  update(inputs, state) {
    this.childrenChanged();
    state.disable = inputs.disabletabs;
    if (state.defaultSelected !== inputs.selected) {
      state.selected = state.defaultSelected = inputs.selected;
    }
    state.selected = Number(state.selected) || 0;
    this.key = state.selected;
  }
  render({tabs: tabNames}, {children, selected}) {
    children?.forEach((c, i) => c.style.display = (i === this.key) ? null : 'none');
    const models = tabNames?.split(',')?.map((tab, i) => ({label: tab}));
    const tabs = models && {$template: "tabT", models};
    return {selected, tabs};
  }
  onTabActivated(e) {
    //console.log(e);
    this.state = {selected: e.detail.index};
    this.key = e.detail.index;
    this.fire('selected');
  }
  onSlotChange(e) {
    //console.log(e.target);
    this.childrenChanged();
  }
  commandeerTabControl() {
    this.bar = this.shadowRoot.querySelector('mwc-tab-bar');
    const die = e => {
      if (this.state.disable) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
    };
    this.bar.addEventListener('click', die, true);
    this.bar.addEventListener('mousedown', die, true);
  }
  childrenChanged() {
    const children = [... this._dom.$('slot').assignedElements({flatten: true})]; // ?? this.children;
    this.state = {children};
    //children.forEach(c => console.log(c.assignedSlot));
    //console.log('childrenChanged: ', children);
  }
}