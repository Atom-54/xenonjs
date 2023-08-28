/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

const template = Xen.Template.html`
<style>
  :host {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background-color: transparent;
    /* opacity: 0; */
    /* opacity: 0.8; */
    /* display: none; */
    z-index: 1000;
  }
  [scrim] {
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.8;
    transition: opacity 200ms ease-in-out;
  }
  [container] {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: opacity 200ms ease-in-out;
    opacity: 0;
  }
</style>

<div scrim xen:style="{{scrimStyle}}"></div>

<div container xen:style="{{containerStyle}}">
  <slot></slot>
</div>

`;

export class ModalView extends Xen.Async {
  static get observedAttributes() {
    return ['show', 'opacity'];
  }
  get template() {
    return template;
  }
  render({show, opacity}) {
    return {
      scrimStyle: {
        opacity: show ? (opacity || 0.8) : 0
      },
      containerStyle: {
        opacity: show ? 1 : 0
        //display: show ? null : 'none'
      }
    };
  }
  _didRender({show}) {
    this.style.pointerEvents = show ?  null : 'none';
    //this.style.display = show ? null : 'none';
  }
  _setValueFromAttribute(name, value) {
    if (name === 'show') {
     value = value === '' || Boolean(value);
   }
   super._setValueFromAttribute(name, value);
  }
}
customElements.define('modal-view', ModalView);
