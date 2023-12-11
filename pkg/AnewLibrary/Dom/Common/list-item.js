/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

export class ListItem extends Xen.Async {
  static get observedAttributes() {
    return ['autofocus', 'focus', 'disabled', 'value', 'static', 'jit'];
  }
  _didMount() {
    this.tabIndex = 1;
    this.input = this._dom.$('input');
    this.addEventListener('keypress', e => this.onKeyPress(e));
    //this.addEventListener('blur', e => this.onBlur(e));
    //this.addEventListener('dblclick', e => this.onDblClick(e));
    // this.addEventListener('click', e => this.onClick(e), {capture: true});
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
      // TODO(sjmiles): hack for GraphList
      this.parentElement?.parentElement?.parentElement?.scrollIntoView({behavior: 'smooth'});
    } 
  }
  doFocus(focus) {
    if (this.state.lastFocus !== focus) {
      this.state.lastFocus = focus;
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
  }
  // onInput() {
  //   this.value = this.input.value;
  //   this.fire('input');
  // }
  onChange(e) {
    this.state = {userEnabled: false};
    this.value = this.input.value;
    this.fire('change');
  }
  // onBlur() {
  //   if (this.state.userEnabled) {
  //     this.value = this.input.value;
  //     this.state = {userEnabled: false};
  //     this.fire('change');
  //   }
  // }
  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.doEnableEdit();
    }
  }
  // onClick() {
  //   if (!this.disabled && this.jit) {
  //     if (theClicked === this && (Date.now() - theClickedTime) < theClickedWindow) {
  //       this.doEnableEdit();
  //       theClicked = null;
  //     } else {
  //       theClicked = this;
  //       theClickedTime = Date.now();
  //     }
  //   }
  // }
  // onDblClick() {
  //   this.doEnableEdit();
  // }
  doEnableEdit() {
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
    /* margin: 2px; */
    height: 100%;
    width: 100%;
    border: none;
  }
  input[disabled] {
    pointer-events: none;
  }
  input[disabled]:not([jit]) {
    color: gray;
  }
</style>
<input jit$="{{jit}}" disabled="{{disabled}}" type="{{type}}" value="{{value}}" on-blur="onBlur" on-change="onChange">
`;
  }
}

let theClicked;
let theClickedTime;
const theClickedWindow = 200;

customElements.define('list-item', ListItem);
