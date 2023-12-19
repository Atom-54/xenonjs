/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

export class FancyInput extends Xen.Async {
  static get observedAttributes() {
    return ['autofocus', 'focus', 'disabled', 'value', 'static', 'jit'];
  }
  _didMount() {
    this.input = this._dom.$('input');
    this.addEventListener('dblclick', e => this.onDblClick(e));
    this.addEventListener('click', e => this.fire('doclick'));
  }
  _setValueFromAttribute(name, value) {
    switch (name) {
      case 'disabled':
      case 'static':
      case 'focus':
      case 'autofocus':
      case 'jit':
        value = Boolean(value) || (typeof value === 'string');
        break;
    }
    super._setValueFromAttribute(name, value);
  }
  _wouldChangeProp(name, value) {
    return (name === 'focus') || super._wouldChangeProp(name, value);
  }
  render({value, disabled, jit}, {userEnabled}) {
    return {
      value: value ?? '',
      type: 'text',
      disabled: disabled || (jit && !userEnabled),
      jit
    };
  }
  _didRender({disabled, autofocus, focus, jit}, {userEnabled}) {
    focus = !disabled && (focus || (jit && userEnabled) || autofocus);
    this.doFocus(focus);
    if (autofocus && focus) {
      // TODO(sjmiles): super-hack for GraphList
      this.parentElement?.parentElement?.parentElement?.scrollIntoView({behavior: 'smooth'});
    } 
  }
  doFocus(focus) {
    if (focus) {
      this.input.select?.();
    } else {
      // ridiculous unselection hack
      const v = this.input.value;
      this.input.value = '';
      this.input.value = v;
    }
    this.input[focus ? 'focus' : 'blur']?.();
  }
  // onInput() {
  //   this.value = this.input.value;
  //   this.fire('input');
  // }
  onChange() {
    this.state = {userEnabled: false};
    this.value = this.input.value;
    this.fire('change');
  }
  onBlur() {
    this.value = this.input.value;
    this.state = {userEnabled: false};
    this.fire('blur');
  }
  onDblClick() {
    if (!this.disabled && this.jit) {
      this.state = {userEnabled: true};
    }
  }
  get template() {
    return Xen.Template.html`
<style>
  input {
    box-sizing: border-box;
    color: inherit;
    background: inherit;
    font: inherit;
    border: inherit;
    padding: 4px 6px;
    margin: 2px;
    height: 100%;
    /* width: 15em; */
    width: 94%;
    border: none;
  }
  input[disabled]:not([jit]) {
    color: gray;
  }
</style>
<input jit$="{{jit}}" disabled="{{disabled}}" type="{{type}}" value="{{value}}" on-blur="onBlur" on-change="onChange" Xon-input="onInput">
`;
  }
}

customElements.define('fancy-input', FancyInput);
