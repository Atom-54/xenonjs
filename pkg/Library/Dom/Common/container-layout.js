/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';
import {DragDrop} from './drag-drop.js';
import {IconsCss} from '../Material/material-icon-font/icons.css.js';

const {assign} = Object;

export class ContainerLayout extends DragDrop {
  static get observedAttributes() {
    return [
      'selected',
      'rects',
      'zoom',
      'color'
    ];
  }
  _didMount() {
    this.boxer = this._dom.$('[boxer]');
    document.addEventListener('keydown', event => this.onKeydown(event));
  }
  update(inputs, state) {
    // De-dedup inputs to get rid of UI flashes (caused by rects being rendered
    // in old positions right after being moved to a new position).
    const inputsJson = JSON.stringify(inputs);
    if (state.inputsJson !== inputsJson) {
      state.inputsJson = inputsJson;
      this.updateGeometry();
    }
  }
  onKeydown(event) {
    if (!this.hasActiveInput()) {
      // Delete the selected node or edge when pressing the "backspace" or "delete" key .
      if (event.key === 'Backspace' || event.key === 'Delete') {
        this.deleteAction(this.target);
      }
    }
  }
  hasActiveInput() {
    const active = this.getActiveElement(document);
    return active?.contentEditable
      || ['INPUT', 'SELECT', 'TEXTAREA'].includes(active?.tagName)
      ;
  }
  getActiveElement({activeElement}) {
    return activeElement?.shadowRoot ? this.getActiveElement(activeElement.shadowRoot) : activeElement;
  }
  render({color}) {
    const styleOverrides = `
      [edge] {
        border-color: ${color}
      }
      [corner] {
        border-color: ${color}
      }
    `;
    return {
      styleOverrides
    };
  }
  getTargetKey(target) {
    return target?.getAttribute('particle');
  }
  deleteAction(target) {
    if (target) {
      this.key = this.getTargetKey(target);
      this.fire('delete');
    }
  }
  onSlotChange() {
    this.updateGeometry();
  }
  updateGeometry() {
    this.updateSelectionAndPositions(this.selected, this.rects);
  }
  updateSelectionAndPositions(selected, rects) {
    rects?.forEach(({id, position}) => this.position(id, position));
    this.select(null);
    selected?.forEach(id => {
      if (this.getChildById(id)) {
        this.select(id);
      }
    });
  }
  position(id, position) {
    if (position == null) {
      // Set initial position to (16, 16);
      const target = this.getChildById(id);
      if (target) {
        const rect = this.getRect(target);
        if (rect.l === 0 && rect.t === 0) {
          rect.l = 16;
          rect.t = 16;
        }
        this.setBoxStyle(target, rect);
        this.firePosition(target);
      }
    } else {
      const child = this.getChildById(id);
      if (child && position) {
        this.setBoxStyle(child, position);
      }
    }
  }
  select(id) {
    this.target = this.getChildById(id);
    // TODO(mariakleiner): it is possible that the `target` hasn't rendered yet and will remain unselected.
    this.rect = this.target && this.getRect(this.target);
    this.restyleSelection();
    this.updateOrders(this.target);
  }
  firePosition(target, eventId) {
    this.key = this.getTargetKey(target);
    this.value = null;
    if (target) {
      const {l, t, w, h} = this.getRect(target);
      this.value = {l, t, w, h};
    }
    this.fire(eventId ?? 'position');
  }
  updateOrders(target) {
    const particleDivs = this.querySelectorAll('[id]');
    particleDivs.forEach(div => {
      // if (!this.rects?.find(rect => rect.id === div.id)) {
      //   //console.warn('wot', div);
      //   div.style.zIndex = 98;
      // } else {
        // z is y, so panels always stack neatly
        const z = div.style.transform?.match(/, (\d+)/)?.[1];
        //div.style.zIndex = z;
        div.style.zIndex = div === target ? 10000 : z;
      // }
    });
  }
  // deselect when clicking empty backgroud
  onContainerDown(e) {
    this.select(null);
    this.firePosition(null);
  }
  //
  // implement drag-drop handlers
  doDown(e) {
    e.stopPropagation();
    // dom target
    const attrs = e.target.attributes;
    const edges = ['top', 'right', 'bottom', 'left'];
    const from = edges.map(e => attrs[e]?.name).join(':');
    if (from === ':::') {
      // component target
      this.dragKind = 'move';
      this.target = this.getEventTarget(e);
    } else {
      // resize target
      this.dragKind = 'resize';
      this.dragFrom = from;
    }
    this.rect = this.target && this.getRect(this.target);
    this.restyleSelection();
    this.updateOrders(this.target);
    // This is to select the node right away when pointer is down.
    this.firePosition(this.target);
    // TODO(sjmiles): hack to allow dragging only from title bar
    // if (from === ':::') {
    //   const t0 = e.composedPath?.()?.[0];
    //   //console.log(t0 && t0.attributes.title);
    //   if (t0 && !t0.attributes.title) {
    //     return false;
    //   }
    // }
  }
  doMove(dx, dy) {
    // grid-snap
    const snap = rect => ({...DragDrop.snap(rect, 16), w: rect.w, h: rect.h});
    if (this.target && this.rect) {
      // perform drag operation
      const dragRect = this.doDrag(snap(this.rect), dx, dy, this.dragKind, this.dragFrom);
      // install output rectangle
      this.setBoxStyle(this.target, snap(dragRect));
      requestAnimationFrame(() => this.setBoxStyle(this.boxer, this.getRect(this.target)));
    }
  }
  doDrag({l, t, w, h}, dx, dy, dragKind, dragFrom) {
    dx /= this.zoom || 1;
    dy /= this.zoom || 1;
    if (dragKind === 'move') {
      return {l: l+dx, t: t+dy, w, h};
    } else if (dragKind === 'resize') {
      if (dragFrom.includes('top')) {
        t = t+dy;
        h = h-dy;
      }
      if (dragFrom.includes('bottom')) {
        h = h+dy;
      }
      if (dragFrom.includes('left')) {
        l = l+dx;
        w = w-dx;
      }
      if (dragFrom.includes('right')) {
        w = w+dx;
      }
    }
    return {l, t, w, h};
  }
  doUp() {
    if (this.target) {
      this.firePosition(this.target, 'position-changed');
      this.target.style.zIndex = this.target.style.transform?.match(/, (\d+)/)?.[1];
    }
  }
  //
  sanitizeId(id) {
    return id?.replace(/[$)(:]/g, '_');
  }
  getChildById(id) {
    return this.querySelector(`#${this.sanitizeId(id)}`);
  }
  getEventTarget(e) {
    const p = e.composedPath();
    const i = p.indexOf(e.currentTarget);
    return p[i-1];
  }
  getRect(elt) {
    const local = elt.getBoundingClientRect();
    // it's possible elt has lost it's parent (temporarily)
    const parentRect = elt.offsetParent?.getBoundingClientRect() ?? {x: 0, y: 0};
    const scrollTop = elt.offsetParent?.scrollTop || 0;
    const scrollLeft = elt.offsetParent?.scrollLeft || 0;
    return {
      l: local.x - parentRect.x + scrollLeft,
      t: local.y - parentRect.y + scrollTop,
      w: local.width, h: local.height
    };
  }
  setBoxStyle(elt, {l, t, w, h}) {
    [l, t, w, h] = [l, t, w, h].map(Math.round);
    assign(elt.style, {
      transform: `translate(${l}px, ${t}px)`,
      width: `${!(w>0) ? 0 : w}px`,
      height: `${!(h>0) ? 0 : h}px`
    });
  }
  restyleSelection() {
    this.boxer.hidden = !this.target;
    if (this.target) {
      this.setBoxStyle(this.boxer, this.getRect(this.target));
    }
  }
  get template() {
    return Xen.Template.html`
<style>
  ${IconsCss}
  :host {
    user-select: none;
    position: relative;
    background-image: radial-gradient(var(--xcolor-two) 15%, transparent 15%) !important;
    background-position: -8px -8px, 0 0;
    background-size: 16px 16px;
    /* handles */
    --size: 9px;
    --center: -7px;
    --offset: -4px;
  }
  * {
    box-sizing: border-box;
  }
  ::slotted(*) {
    position: absolute;
  }
  [container] {
    flex: 1;
  }
  [boxer] {
    pointer-events: none;
    position: absolute;
    background-color: transparent;
    box-sizing: border-box;
    transform: translate(-1000px, 0);
    z-index: 100;
  }
</style>
<style>${'{{styleOverrides}}'}</style>
<div container on-pointerdown="onContainerDown">
  <slot on-pointerdown="onDown" on-pointerup="onUp" on-slotchange="onSlotChange"></slot>
</div>
<div boxer on-pointerdown="onDown"></div>`;
  }
}

customElements.define('container-layout', ContainerLayout);
