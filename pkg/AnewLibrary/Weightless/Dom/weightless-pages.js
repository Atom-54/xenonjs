/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {IconsCss} from '../../Dom/Material/material-icon-font/icons.css.js';

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
    // TODO(sjmiles): client order is not correct with asynchrony
    setTimeout(() => this.childrenChanged(), 100);
  }
  update({tabs, selected, disabletabs}, state) {
    this.childrenChanged();
    state.disable = disabletabs;
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
  onSlotChange(e) {
    this.childrenChanged();
  }
  childrenChanged() {
    const children = [...this._dom.$('slot').assignedElements({flatten: true})]; // ?? this.children;
    this.state = {children};
  }
}

customElements.define('weightless-pages', WeightlessPages);
