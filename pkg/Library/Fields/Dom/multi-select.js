/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';

export class MultiSelect extends Xen.Async {
  static get observedAttributes() {
    return ['disabled', 'selected', 'multiple', 'size', 'options'];
  }

  _didMount() {
    this.selector = this._dom.$('select');
  }

  update(inputs, state) {
    Object.assign(state, inputs);
    const {options, multiple, selected, disabled} = inputs;
    state.multiple = multiple || multiple === '';
    state.size = this.chooseSize(inputs);
    let selectedKey = null;
    state.options = options?.map(opt => {
      if (!(typeof opt === 'object')) {
        opt = {key: String(opt), name: opt};
      }
      if (opt.separator) {
        opt.key = opt.name = '______';
        opt.disabled = true;
      } else if (opt.selected || (opt.key === selected)) {
        opt.selected = true;
        selectedKey = opt.key;
      }
      return opt;
    });
    if ((selectedKey === null) && !state.multiple) {
      state.options?.splice(0, 0, {key: '', name: '', selected: true});
    }
  }
  
  chooseSize({multiple, size, options}) {
    if (multiple) {
      if (options?.length > 0) {
        return size ?? 4;
      }
      return 1;
    }
  }

  onChange() {
    const values = [];
    for (const option of this.selector.options) {
      if (option.selected && option.value) {
        values.push(option.value);
      }
    }
    this.value = this.state.multiple ? values : values?.[0];
    this.fire('change');
  }

  onClick(e) {
    e.stopPropagation();
  }

  get template() {
    return Xen.Template.html`
<style>
  [options] {
    font-size: 12px;
    width: 100%;
    height: 100%;
    border: 1px solid var(--theme-color-fg-0);
    border-radius: 4px;
    padding: 4px;    
  }
  [options][multiple] {
    /* height: 200px; */
    height: auto;
  }
</style>

<!-- size="{{size}}" -->
<select 
  options 
  disabled="{{disabled}}" 
  multiple="{{multiple}}" 
  size="{{size}}" 
  on-change="onChange"
  on-click="onClick"
  repeat="select_option_t"
>{{options}}</select>

<template select_option_t>
  <option selected="{{selected}}" value="{{key}}" disabled="{{disabled}}">{{name}}</option>
</template>
`;
  }
}

customElements.define('multi-select', MultiSelect);
