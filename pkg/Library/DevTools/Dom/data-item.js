/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import './data-explorer.js';

const template = Xen.Template.html`

<style>
  :host {
    white-space: nowrap;
    --di-left-color: #cdcdcd;
    --di-number-color: #61cbff;
    --di-json-color: #54c354;
    --di-string-color: #b197fc;
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
    padding: 4px 0px 4px 0;
    color: var(-di-left-color);
    cursor: pointer;
    font-weight: bold;
  }
  right {
    display: flex;
    align-items: center;
  }
  /* right > [value] {
    max-height: 100px;
    overflow-x: visible;
    overflow-y: auto;
  } */
  [expand] {
    padding-bottom: 3px;
  }
  [expand]:before {
    display: inline-block;
    box-sizing: border-box;
    width: 1.2rem;
    font-family: monospace;
    text-align: center;
    /*
    content: '▸'
    content: '▶'
    */
    color: orange;
    content: '▶'
  }
  [expand][expanded]:before {
    /*
    content: '•'
    content: '⯆'
    content: '◉'
    content: '●'
    content: '⏺'
    */
    color: violet;
    content: '•'
  }
  [expand][expanded][object]:before {
    color: green;
    content: '▼';
  }
  data-explorer:not([hidden]) {
    padding-left: 16px;
  }
  [type="number"] {
    color: var(--di-number-color);
  }
  [type="string"] {
    color: var(--di-string-color);
  }
  [type="string"]::before, [type="string"]::after {
    content: '"';
  }
  [json] {
    font-weight: normal;
    color: var(--di-json-color);
  }
</style>

<container object$="{{isobject}}">
  <left title="{{name}}" on-click="_onExpandClick">
    <span expand expanded$="{{hideexpand}}" object$="{{isobject}}" on-click="_onExpandClick"></span>
    <span>{{name}}</span>&nbsp;<span json Xunsafe-html="{{json}}">{{json}}</span>
  </left>
  <right>
    <div check hidden="{{notbool}}" title="{{name}}"><input type="checkbox" checked="{{value}}" on-click="_onCheckInput"></div>
    <div value type$="{{type}}" hidden="{{notstring}}" title="{{title}}" style="white-space: pre;">{{value}}</div>
    <data-explorer hidden="{{notobject}}" object="{{object}}" expand="{{expanded}}"></data-explorer>
  </right>
</container>
`;

class DataItem extends Xen.Base {
  static get observedAttributes() {
    return ['name', 'value', 'expand', 'kind'];
  }
  get template() {
    return template;
  }
  _onCheckInput(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('item-change', {detail: e.target.checked}));
  }
  _update({expand}, state) {
    expand = expand && Number(expand);
    //console.warn('item: expand', expand);
    if (state.defaultExpanded !== expand) {
      state.expanded = state.defaultExpanded = expand;
    }
  }
  _render({name, value}, state) {
    // always expand array indices
    if (!isNaN(Number(name))) {
      state.expanded = true;
    }
    let type = typeof value;
    if (type === 'function') {
      value = '(function)';
    }
    else if (type === 'string' && !isNaN(Number(value))) {
      type = 'number';
    }
    const isnull = value === null;
    const isobject = (type === 'object' && !isnull);
    const isempty = isobject && !Object.keys(value).length;
    const isstring = (type === 'string' || type === 'number' || isnull);
    const isbool = (type==='boolean');
    const {expanded} = state;
    //
    let json;
    if (value === null) {
      // json = '(null)';
    } else if (isobject) {
      const keys = Object.keys(value);
      if (Array.isArray(value)) {
        json = `(${keys.length} items)`;
      } else if (keys?.length === 0) {
        json = ''; //'(empty)';
      } else if (!expanded) {
        // json = '...';
        json = this.previewValue(value);
      }
    }
    if (typeof value === 'string') {
      value = value./*replace(/</g, '&lt;').*/replace(/\n/g, '\\n');
      if (value.length > 50) {
        value = `${value.slice(0, 45)}...`;
      }
    }
    // else {
    //   try {
    //     json = !isobject || expanded ? '' : isempty ? '{}' : JSON.stringify(value);
    //     if (json.length > 60) {
    //       json = `${json.slice(0, 60)}...`;
    //     }
    //   } catch(x) {
    //     json = '<span style="color: violet;">(circular)</span>';
    //   }
    // }
    //
    const uiIsObject = isobject && expanded && Object.keys(value).length;
    const uiObject = uiIsObject ? value : null;
    //const labelize = key => key.includes('$') ? (key.startsWith('$') ? key.slice(1) : key.slice(7)).replace(/\$/g, '∙') : key;
    return {
      expanded,
      type,
      name: name, //labelize(name),
      value: (isnull || isobject) ? 'null' : (isbool ? value : String(value)),
      isobject: uiIsObject,
      notobject: !uiIsObject,
      notstring: !isstring,
      notbool: !isbool,
      object: uiObject,
      json,
      hideexpand: expanded || !isobject || isempty,
      title: isstring ? value : name
    };
  }
  previewValue(value) {
    if (Array.isArray(value)) {
      return `[${value.slice(0, 5).map(elem => this.previewValue(elem)).join(',')}]`;
    } else if (!value) {
      return value == false ? 'false' : value == null ? 'null' : 'undefined';
    } else if (typeof value === 'object') {
      return `{${Object.keys(value)
        .filter(k => value[k] !== undefined)
        .slice(0, 5)
        .map(k => `${k}: ${this.previewValue(value[k])}`)}}`;
    } else if (typeof value === 'string') {
      value = value.replace(/</g, '&lt;').replace(/\n/g, '\\n');
      if (value.length > 50) {
        return `'${value.slice(0, 45)}...'`;
      } else {
        return `'${value}'`;
      }
    } else {
      return value.toString();
    }
  }
  _onExpandClick(e) {
    e.stopPropagation();
    this._setState({expanded: !this._state.expanded});
  }
}

customElements.define('data-item', DataItem);
