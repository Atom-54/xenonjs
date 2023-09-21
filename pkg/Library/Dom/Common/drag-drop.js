/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

const log = logf('DOM: drag-drop', '#111', 'orange');

/**
 * originally intended to provide custom (non-DOM) dragging operations
 * mostly used for resizing, dragging, panning, and so on
 */
export const DragDrop = class extends Xen.Async {
  onDown(e) {
    // this 'e' is from local context
    if (this.doDown(e) !== false) {
      log('onDown: doDown allows dragging');
      this.dragging = true;
      this.listeners = {
        move: this.onMove.bind(this),
        up: this.onUp.bind(this)
      };
      window.addEventListener('pointermove', this.listeners.move);
      window.addEventListener('pointerup', this.listeners.up);
      //log('onDown: started listening');
      const {pageX, pageY} = e;
      const [x, y] = [pageX, pageY].map(Math.round);
      this.dragStart = {x, y};
    } else {
      log('onDown: doDown disallows dragging');
      //this.dragging = false;
    }
  }
  onMove(e) {
    // this 'e' is from window context
    //e.preventDefault();
    if (!e.buttons) {
      log('onMove: no buttons: forcing onUp');
      // Force onUp in case the pointer was released out of our view
      // onUp needs to be aware of this scenario
      this.onUp(e);
    } else if (this.dragging) {
      e.preventDefault();
      const {x, y} = this.dragStart;
      const {pageX, pageY} = e;
      const [dx, dy] = [pageX-x, pageY-y];
      //log('onMove: dragging (sorry log)', dx, dy, pageX, pageY);
      // pass control to client
      this.doMove(dx, dy, pageX, pageY, x, y);
    }
  }
  onUp(e) {
    // this 'e' is from window context
    if (this.dragging) {
      log('onUp: done dragging');
      // officially not dragging if onUp
      this.dragging = false;
      // clean up the scary dangly bits
      if (this.listeners) {
        //log('onUp: done listening');
        window.removeEventListener('pointermove', this.listeners.move);
        window.removeEventListener('pointerup', this.listeners.up);
        this.listeners = null;
      }
      // pass control to client
      this.doUp();
    }
  }
  // ordinal-snap
  static grid(o, size) {
    return Math.round(o / size) * size;
  }
  // rectangle-snap
  static snap({l, t, w, h}, size) {
    const {grid} = DragDrop;
    l = grid(l, size);
    t = grid(t, size);
    w = grid(w+1, size) - 1;
    h = grid(h+1, size) - 1;
    return {l, t, w, h};
  }
  doDown(e) {
  }
  doMove(dx, dy, sx, sy, x0, y0) {
  }
  doDrag({l, t, w, h}, dx, dy, dragKind, dragFrom) {
  }
  doUp() {
  }
};
