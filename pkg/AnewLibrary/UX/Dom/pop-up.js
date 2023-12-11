/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';

export class PopUp extends Xen.Async {
  static get observedAttributes() {
    return ['items', 'x', 'y', 'show'];
  }
  _didMount() {
    window.addEventListener('mousedown', e => {
      if (this.state.show) {
        e.preventDefault();
        e.stopPropagation();
        this.showOrHide(false);
      }
    });
  }
  update({show}) {
    this.showOrHide(show);
  }
  showOrHide(show) {
    const hide = !show && show !== '';
    this.style.opacity = hide ? 0 : 1;
    this.style.pointerEvents = hide ? 'none' : '';
    this.state.show = !hide;
  }
  onMouseDown(e) {
    e.stopPropagation();
  }
  render({items}, state) {
    state.items = items ?? [{label: "Item 1"}, {label: "Item 2"}];
    const modelItems = state.items.map((item, i) => ({
      key: i,
      ...item
    }));
    return {items: modelItems};
  }
  _didRender({x, y, show}) {
    this.showOrHide(show);
    // offset menu from cursor a bit
    y += 4;
    x += 12;
    // screen center
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    // menu center
    const dx = this.offsetWidth/2;
    const dy = this.offsetHeight/2;
    // menu position @ center
    //const [px, py] = [x + dx, y + dy];
    // unit distance from screen center
    //const [dcx, dcy] = [(x - cx)/cx, (y - cy)/cy];
    // const dcx = (x + dx - cx) / cx;
    // const dcy = (y + dy+dy - cy) / cy;
    //console.log(dx, dy, dcx, dcy);
    // spread distance for half-interval menu width
    // unit distance * interval
    //console.log(x, y, x+dcx*dx, y+dcy*dy);
    //x += dcx*dcx * dx;
    //y -= dcy*dcy * dy;
    //console.log(x, y);
    // ramp out to margin edge
    // const dcy = cy - y;
    // if (y > cy) {
    //   y += dy * dcy / cy;
    // } else if (y < cy) {
    //   y += dy * dcy / cy;
    // }
    // const dcx = cx - x;
    // if (x > cx) {
    //   x += dx * dcx / cx;
    // } else if (x < cx) {
    //   x += dx * dcx / cx;
    // }
    x = Math.max(4, Math.min(cx+cx-dx-dx, x));
    y = Math.max(4, Math.min(cy+cy-dy-dy, y));
    this.style.transform = `translate(${x}px, ${y}px)`;
  }
  onItemClick(e) {
    e.stopPropagation();
    const label = this.state.items?.[e.target.key]?.label;
    this.value = label;
    this.showOrHide(false);
    // console.warn(e.target.key, label);
    this.fire('menu-select');
  }
  get template() {
    return Xen.Template.html`
<style>
  :host {
    position: fixed;
    left: 0;
    top: 0;
    transform: translate(0,-100em);
    opacity: 0;
    transition: opacity 100ms ease-in;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    cursor: pointer;
    padding: 2px 0;
    border: 1px solid silver;
    border-radius: 3px;
    z-index: 200000;
  }
  menu {
    display: inline-block;
    margin-block: 0;
    padding-inline-start: 0;
  }
  li {
    list-style-type: none;
    padding: 10px 22px;
  }
  li:hover {
    background: #f1f1f1;
  }
</style>

<menu on-mousedown="onMouseDown" repeat="item_t">{{items}}</menu>

<template item_t>
  <li key="{{key}}" on-click="onItemClick">{{label}}</li>
</template>
  `
  }
}

customElements.define('pop-up', PopUp);