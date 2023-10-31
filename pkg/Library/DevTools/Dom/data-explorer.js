/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import './data-item.js';

const template = Xen.Template.html`

<style>
  :host {
    display: block;
  }
  data-item {
    cursor: grab;
    user-select: none;
  }
</style>

<div>{{items}}</div>

`;

const templateDataItem = Xen.Template.html`
<data-item draggable="true" 
  name="{{name}}" value="{{value}}" expand="{{expand}}" 
  on-item-change="onItemChange" on-dragstart="onDragStart"></data-item>
`;

//const nob = Object.create(null);

class DataExplorer extends Xen.Base {
  static get observedAttributes() {
    return ['object', 'expand'];
  }
  get template() {
    return template;
  }
  _wouldChangeValue(map, name, value) {
    return (name === 'object') || super._wouldChangeValue(map, name, value);
  }
  _setValueFromAttribute(name, value) {
    // convert boolean-attribute to boolean
    if (name == 'expand') {
      value = (value === '') ? true : value ? Number(value) : value;
    }
    super._setValueFromAttribute(name, value);
  }
  _render({object, expand}) {
    return {
      items: {
        template: templateDataItem,
        models: this._formatValues(object, expand)
      }
    };
  }
  _formatValues(object, expand) {
    if (object == undefined) {
      return [];
    }
    expand = (expand === '') ? 2 : expand ? Number(expand) - 1 : 0;
    //console.warn('explore: expand', expand);
    if (typeof object !== 'object') {
      return [{name: '', value: (object === null) ? 'null' : String(object), expand}];
    }
    // only do so many...
    const keys = Object.keys(object).slice(0, 100);
    const mapped = keys.map(name => ({name: `${name}:`, value: object[name], expand}));
    const sorted = mapped.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }
  onItemChange(e) {
    //console.log(e.target.name, e.detail);
    this.object[e.target.name] = e.detail;
    this.dispatchEvent(new CustomEvent('object-change', {bubbles: true}));
  }
  onDragStart(e) {
    e.dataTransfer.setData('text/plain', this.key ?? 42);
  }
}
customElements.define('data-explorer', DataExplorer);
