/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';

const template = Xen.Template.html`

<style>
  :host {
    display: block;
    white-space: nowrap;
  }
  container {
    display: flex;
  }
  container[object] {
    display: block;
  }
  left {
    display: inline-flex;
    flex-shrink: 0;
    color: #6A6A6A;
    cursor: pointer;
  }
  right {
    display: flex;
    align-items: center;
  }
  [expand]:before {
    font-size: 90%;
    padding-right: 4px;
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    font-family: monospace;
    /*
    vertical-align: middle;
    content: '▸'
    content: '▶'
    */
    content: '▶'
  }
  [expand][expanded]:before {
    content: '▼';
  }
  [expand][single]:before {
    /*
    font-size: 60%;
    content: '•'
    content: '⯆'
    content: '◉'
    content: '●'
    content: '⏺'
    */
    content: ''
  }
  [bottom] {
    display: none;
    /* padding-left: 4px; */
  }
  [bottom][expanded] {
    display: flex;
  }
  [flex] {
    flex: 1;
  }
  [cols], [rows] {
    display: flex;
    align-items: center;
  }
  [rows] {
    flex-direction: column;
    align-items: stretch;
  }
  [clipped] {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

<container rows>
  <div top cols on-click="_onExpandClick">
    <span expand single$="{{single}}" expanded$="{{expanded}}"></span>
    <span clipped flex><slot name="label"></slot></span>
  </div>
  <div bottom expanded$="{{expanded}}">
    <slot></slot>
  </div>
</container>

`;

class ExpandableItem extends Xen.Base {
  static get observedAttributes() {
    return ['expand', 'single'];
  }
  get template() {
    return template;
  }
  _update({expand}, state) {
    if (state.defaultExpanded !== expand) {
      state.expanded = state.defaultExpanded = Boolean(expand || expand==='');
    }
  }
  _render({single}, {expanded}) {
    return {
      single: Boolean(single),
      expanded: Boolean(expanded)
    };
  }
  _onExpandClick(e) {
    e.stopPropagation();
    this._setState({expanded: !this._props.single && !this._state.expanded});
  }
}

customElements.define('expandable-item', ExpandableItem);
