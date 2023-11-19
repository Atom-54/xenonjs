/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';
import {IconsCss} from '../../../Library/Dom/Material/material-icon-font/icons.css.js';

const template = Xen.Template.html`
<style>
  ${IconsCss}
  :host {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--theme-color-bg-2);
  }
  icon {
    cursor: pointer;
    padding: 4px 0 2px 4px;
  }
  [row] {
    display: flex;
    align-items: center;
  }
</style>

<!-- tabs -->
<wl-tab-group vertical="{{vertical}}" selectedtab="{{selectedTab}}" on-change="onTabChange" repeat="tabT">{{tabs}}</wl-tab-group>
<template tabT>
  <wl-tab key="{{label}}" checked="{{active}}">
    <span row>
      <span>{{label}}</span>
      <!-- <icon>close</icon> -->
    <span>
  </wl-tab>
</template>

<!-- content -->
<slot on-slotchange="onSlotChange"></slot>
`;

export class WeightlessPages extends Xen.Async {
  static get observedAttributes() {
    return ['tabs', 'selected', 'disabletabs', 'vertical'];
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
    //this.commandeerTabControl();
    // TODO(sjmiles): client order is not correct with asynchrony
    setTimeout(() => this.childrenChanged(), 100);
  }
  update({tabs, selected, disabletabs}, state) {
    this.childrenChanged();
    state.disable = disabletabs;
    // if (state.defaultSelected !== selected) {
    //   state.selected = state.defaultSelected = selected;
    // }
    // state.selected = Number(state.selected) || 0;
    state.tabNames = tabs?.split(',');
    this.value ??= state.tabNames?.find(name => name === selected) ? selected : state.tabNames?.[0];
    this.key = state.tabNames?.indexOf(this.value);
  }
  render({vertical}, {tabNames}) {
    return {
      selectedTab: this.value, 
      tabs: tabNames?.map((tab, i) => ({
        label: tab,
        active: i === this.key
      })),
      vertical
    };
  }
  _didRender({}, {children}) {
    children.sort((a, b) => (Number(a?.style?.order) || 0) - (Number(b?.style?.order) || 0));
    children?.forEach((c, i) => c.style.display = (i === this.key) ? null : 'none');
  }
  onTabChange(e) {
    this.value = e.target.key;
    this.fire('selected');
    this.invalidate();
  }
  // onTabActivated(e) {
  //   //console.log(e);
  //   this.state = {selected: e.detail.index};
  //   this.key = e.detail.index;
  //   this.fire('selected');
  // }
  onSlotChange(e) {
    //console.log(e.target);
    this.childrenChanged();
  }
  // commandeerTabControl() {
  //   this.bar = this.shadowRoot.querySelector('mwc-tab-bar');
  //   const die = e => {
  //     if (this.state.disable) {
  //       e.stopImmediatePropagation();
  //       e.stopPropagation();
  //       e.preventDefault();
  //       return false;
  //     }
  //   };
  //   this.bar.addEventListener('click', die, true);
  //   this.bar.addEventListener('mousedown', die, true);
  // }
  childrenChanged() {
    const children = [...this._dom.$('slot').assignedElements({flatten: true})]; // ?? this.children;
    this.state = {children};
    //children.forEach(c => console.log(c.assignedSlot));
    //console.log('childrenChanged: ', children);
  }
}

customElements.define('weightless-pages', WeightlessPages);
