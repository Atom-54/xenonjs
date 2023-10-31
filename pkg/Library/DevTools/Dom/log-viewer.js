/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {XenCss} from '../../Dom/Material/material-xen/xen.css.js';

const template = Xen.Template.html`
<style>
  :host {
    display: block;
    font-size: 0.8rem;
  }
  [toolbar] {
    background-color: #cdcdcd60;
  }
  [box] {
    border-bottom: 1px solid #cdcdcd30;
    padding: 6px;
  }
  [label] {
    color: #cdcdcd;
  }
  expandable-item {
    padding: 6px;
  }
  [json] {
    padding: 6px;
    margin: 0;
    color: #b197fc;
  }
  input {
    border-radius: 6px;
  }
</style>
<style>${XenCss}</style>

<div toolbar>
  <span>Filter </span><input flex on-input="onFilterChange" value="{{filter}}">
</div>

<div flex scrolling repeat="log_t">{{logs}}</div>

<template log_t>
  <div box>
    <div entry>
      <span name xen:style="{{format}}">{{name}}</span>
      <span label>{{msg}}</span>
      
      <expandable-item hidden$="{{noJson}}">
        <span slot="label">detail</span>
        <pre json>{{json}}</pre>
      </expandable-item>
    </div>
  </div>
</template>
`;

class LogViewer extends Xen.Async {
  static get observedAttributes() {
    return ['logs'];
  }
  get template() {
    return template;
  }
  render({logs}, {filter}) {
    return {
      //logs: logs ? this.renderLogs(logs, filter) : [{name: 'empty'}]
      logs: [{name: 'sorry, log viewer is out-of-order'}]
    };
  }
  renderLogs(logs, filter) {
    filter = filter?.toLowerCase() ?? '';
    return logs
      .filter(({preamble}) => !filter || preamble.toLowerCase().includes(filter))
      .map(({preamble, format, args}) => ({
        name: preamble,
        format: format?.[1],
        msg: args?.filter(a => (typeof a) !== 'object').join(' '),
        json: args?.filter(a => (typeof a) === 'object').map(a => `${JSON.stringify(a, null, '  ')}`).join('\n'),
        noJson: args?.filter(a => (typeof a) === 'object').length === 0
      }))
      ;
  }
  onFilterChange({currentTarget: {value}}) {
    this.state = {filter: value};
  }
}
customElements.define('log-viewer', LogViewer);
