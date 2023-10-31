/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {deepEqual} from '../../CoreXenon/Reactor/Atomic/js/utils/object.js';
import '../../../third-party/gridstack/gridstack-all.js';
import {css} from '../../../third-party/gridstack/gridstack.min.css.js';

// API Doc:
// https://github.com/gridstack/gridstack.js/tree/master/doc 
const {GridStack} = globalThis;

const template = Xen.Template.html`
<style>
  :host {
    display: flex;
    flex-direction: column;
  }
  ${css}
  .grid-stack {
    background: transparent;
    padding: 0px;
  }
  .grid-stack-item {
    background-color: #57315A; 
    padding: 0px;
    margin: 0px;
  }
  .grid-stack-item-content {
    border: 3px solid #8C2B59;
    background-color: pink;
    color: white;
    padding: 0px;
    margin: 0px;
    inset: 0px !important;
  }
  [selected] .grid-stack-item-content {
    border: 3px dotted fuchsia;
  }
</style>
<div class="grid-stack"></div>
`;

export class DesignGrid extends Xen.Async {
  static get observedAttributes() {
    // setting these properties will automatically trigger `update(inputs)`
    // these are the names of fields in `inputs`
    return ['items'/*, 'selected'*/];
  }
  get template() {
    return template;
  }
  _didMount() {
    // console.log('hello');
    this.grid = GridStack.init({}, this.shadowRoot.querySelector('.grid-stack'));
  }
  update({items/*, selected*/}, state) {
    if (!deepEqual(items, state.items)) {
      state.items = items;
      // TODO: should granularly add/remove individual items?
      this.grid.removeAll();
      this.grid.load(items); 
      // state.selected = null;
      this.grid.getGridItems().forEach(item => {
        item.addEventListener('click', e => this.selectItem(item.getAttribute('gs-id')));
      });
      this.selectItem(state.selected);
    } 
    // if (state.selected !== selected) {
    //   this.selectItem(selected);
    // }
  }
  selectItem(id) {
    this.state.selected = null;
    this.grid.getGridItems().forEach(item => {
      item.removeAttribute('selected');
      const itemId = item.getAttribute('gs-id');
      if (itemId === id) {
        this.state.selected = id;
        item.setAttribute('selected', true);
      }
    });
  }
}

customElements.define('design-grid', DesignGrid);
