/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {DragDrop} from '../../Dom/Common/drag-drop.js';

const log = logf('DOM:atom-graph', 'forestgreen');

const viewport = 6000;
// const defaultSize = [200, 56];

export class AtomGraph extends DragDrop {
  static get observedAttributes() {
    return ['atoms', 'edges', 'schema', 'offsets'];
  }
  get template() {
    return template;
  }
  get container() {
    return this._dom.root;
  }
  get idPrefix() {
    return '';
  }
  _didMount() {
    this.canvas = this.host.querySelector('canvas');
    this.viewport = this.host.querySelector('[viewport]');
    this.state.zoom = this.style.zoom = 0.7;
    //this.state.offsets ??= {};
    this.addEventListener('pointerdown', e => this.onDown(e));
    this.addEventListener('pointermove', e => this.onMove(e));
    this.addEventListener('pointerup', e => this.onUp(e));
  }
  update({selected, offsets}, state, {service}) {
    state.offsets = offsets ?? {};
    //this.key = selected;
  }
  render({atoms, edges}, state) {
    // NB: connectors are drawn after, via Canvas. See _didRender.
    //state.didRender = {edges, atoms};
    // complete render model
    return {atoms, zoom: state.zoom};
  }
  _didRender({atoms, edges}, {x, y, offsets/*, didRender: {atoms, edges}*/}) {
    if (edges) {
      this.renderCanvas({atoms, edges}, {x, y, offsets});
    }
    entries(offsets).forEach(([name, [tx, ty]]) => {
      const elt = this.shadowRoot.querySelector(`#${name.split('$').join('-')}`)
      if (elt) {
        elt.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    });
  }
  clampus(v) {
    const gridSize = 8;
    return Math.floor(v/gridSize)*gridSize;
  }
  renderCanvas({atoms, edges}, {x, y, offsets}) {
    const [ox, oy] = [3000, 3000 + 51];
    const ctx = this.canvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let i = 0;
      const srcEdgeCount = {}, trgEdgeCount = {};
      for (const edge of edges) {
        const source = edge.id.split('$');
        const sourceId = source.slice(0, 3).join('-');
        srcEdgeCount[sourceId] ??= -1;
        const e = ++srcEdgeCount[sourceId];
        const elt = this.shadowRoot.querySelector(`#${sourceId}`);
        if (elt) {
          const [dx, dy] = offsets[source.slice(0,3).join('$')] ?? [0, 0];
          const p0 = {
            x: ox + dx + elt.offsetLeft + elt.offsetWidth,
            y: oy + dy + elt.offsetTop + e*14,
          };
          for (const bound of edge.binding) {
            const target = bound.split('$');
            const targetId = target.slice(0, 3).join('-');
            if (targetId !== sourceId) {
              trgEdgeCount[targetId] ??= -1;
              const b = ++trgEdgeCount[targetId];
              const elt2 = this.shadowRoot.querySelector(`#${targetId}`);
              if (elt2) {
                const [dx, dy] = offsets[target.slice(0,3).join('$')] ?? [0, 0];
                const p1 = {
                  x: ox + dx + elt2.offsetLeft,
                  y: oy + dy + elt2.offsetTop + b*14
                };
                const path = this.calcBezier(p0, p1);
                const highlight = [[21, 100, 100], [100, 21, 21], [21, 100, 21]][(i++)%3];
                this.laserCurve(ctx, path, highlight);
              }
            }
          }
        }
      }
    }
  }
  calcBezier({x:startX, y:startY}, {x:endX, y:endY}) {
      const qx = (endX - startX) / 2;
      const qy = (endY - startY) / 2;
      if (startX < endX) {
      return [
        startX, startY,
        startX + qx, startY,
        endX - qx, endY,
        endX, endY
      ];
    } else {
      return [
        startX, startY,
        startX - qx, startY + qy*3/2,
        endX + qx, endY - qy*3/2,
        endX, endY
      ];
    }
  }
  roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.closePath();
  }
  circle(ctx, c, r) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, r, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
  }
  curve(ctx, path) {
    ctx.beginPath();
    // draw each line, the last line in each is always white
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.moveTo(path[0], path[1]);
    ctx.bezierCurveTo(path[2], path[3], path[4], path[5], path[6], path[7]);
    ctx.stroke();
    ctx.closePath();
  }
  laserCurve(ctx, path, highlight) {
    // lasers!!!!
    for (let i=3; i>=0; i--) {
      ctx.beginPath();
      // draw each line, the last line in each is always white
      ctx.lineWidth = i*1.5 + 1;
      ctx.strokeStyle = !i ? `rgba(${highlight[0]},${highlight[1]},${highlight[2]},1)` : `rgba(${highlight[0]},${highlight[1]},${highlight[2]},${0.25-0.06*i})`;
      ctx.moveTo(path[0], path[1]);
      ctx.bezierCurveTo(path[2], path[3], path[4], path[5], path[6], path[7]);
      ctx.stroke();
      ctx.closePath();
    }
  }
  onAtomSelect(event) {
    event.stopPropagation();
    this.key = event.currentTarget.key;
    this.fire('atom-selected');
  }
  onAtomUnselect(event) {
    this.key = null;
    this.fire('atom-selected');
  }
  onWheel(event) {
    event.preventDefault();
    let zoom = this.state.zoom ?? 1;
    zoom += event.deltaY * 1e-3;
    // clamp
    if (zoom < 0.2) {
      zoom = 0.2;
    } else if (zoom > 5) {
      zoom = 5;
    // snap
    } else if (Math.abs(1-zoom) <= 0.05) {
      zoom = 1.0;
      log('Unity zoom');
    }
    this.state.zoom = this.style.zoom = zoom;
  }
  doMove(dx, dy) {
    const {props, state} = this;
    const [dxz, dyz, v2] = [dx/state.zoom, dy/state.zoom, viewport/2]
    if (Math.abs(dxz) > 0.1 || Math.abs(dyz) > 0.1) {
      if (!this.key) {
        state.moved = true;
        state.tx = Math.min(Math.max((state.x || 0) + dxz, -v2 + 1500), v2);
        state.ty = Math.min(Math.max((state.y || 0) + dyz, -v2 + 1500), v2);
        this.viewport.style.transform = `translate(${state.tx}px, ${state.ty}px)`;
      } else {
        const elt = this.shadowRoot.querySelector(`#${this.key.split('$').join('-')}`);
        if (elt) {
          const off = (state.offsets[this.key] ??= [0, 0]);
          const [zdx, zdy] = [off[0] + dxz, off[1] + dyz];
          const [gx, gy] = [Math.floor(zdx/8)*8, Math.floor(zdy/8)*8];
          state.moved = true;
          state.tx = gx;
          state.ty = gy;
          elt.style.transform = `translate(${gx}px, ${gy}px)`;
          //if (Math.random() < 0.4) {
            //state.offsets[this.key] = [gx, gy];
            //this._didRender(props, state);
            //state.offsets[this.key] = off;
          //}
        }
      }
    }
  }
  doUp() {
    const {props, state} = this;
    if (state.moved) {
      if (this.key) {
        //const offset = state.offsets[this.key];
        //if (offset[0] !== state.tx && offset[1] !== state.ty) {
          state.offsets[this.key] = [state.tx, state.ty];
          this.value = state.offsets;
          this.key = null;
          this.fire('offset-change');
          this._didRender(props, state);
        //}
      } else {
        state.x = state.tx;
        state.y = state.ty;
        // this._didRender(props, state);
      }
    }
    state.moved = false;
  }
  onPointerMove({eventlet}) {
    //log(eventlet);
  }
}

const template = Xen.Template.html`
<style>
  :host {
    display: block;
    user-select: none;
    overflow: hidden !important;
    --main-hue: 304; 
  }
  [viewport] {
    position: relative;
    left: ${-viewport/2}px;
    top: ${-viewport/2}px;
    width: ${viewport}px;
    height: ${viewport}px;
    background-image: radial-gradient(var(--xcolor-two, silver) 15%, transparent 15%);
    background-position: -8px -8px, 0 0;
    background-size: 16px 16px;
  }
  [atom] {
    position: absolute;
    min-width: 100px;
    min-height: 60px;
    border-radius: 8px;
    outline-offset: 4px;
    cursor: pointer;
    opacity: 0.95;
    /* background-color: hsl(var(--main-hue), 50%, 60%); */
    background-color: hsl(var(--main-hue), 40%, 80%);
    color: black;
    /* color: white; */
    overflow: hidden;
    text-overflow: ellipsis;
  }
  [atom][selected] {
    outline: 3px solid purple;
    z-index: 10000;
  }
  [type] {
    font-size: 65%;
    /* background-color: #5b20b7;  */
    background-color: hsl(var(--main-hue), 60%, 45%);
    color: #f1f1f1;
    height: 1em; 
    padding: 0.3rem 0.1rem 0.3rem 0.5rem;
    font-weight: bold;
    text-transform: capitalize; 
  }
  [name] {
    /* background-color: #6720cc;  */
    background-color: hsl(var(--main-hue), 30%, 85%);
    height 3em; 
    padding: 0.3rem 0.1rem 0.3rem 0.5rem;
  }
  [io] {
    /* background-color: #8024f5; */
    background-color: hsl(var(--main-hue), 40%, 80%);
    padding: 0.3rem 0; 
  }
  /**/
  [layer0] {
    position: absolute;
    transform: translate(${viewport/2}px, ${viewport/2}px);
    inset: 0;
  }
  [layer0] > * {
    position: absolute;
    inset: 0;
  }
  [layer1] {
    position: absolute;
    pointer-events: none;
  }
  [dot] {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: lightgreen;
    border: 4px solid rgba(0, 96, 0, 0.8);
    border-radius: 50%;
    margin: 0 .5rem;
  }
  [dot][left] {
    margin-left: -6px;
  }
  [dot][right] {
    margin-right: -6px;
  }
  [input], [output] {
    overflow: hidden; 
    text-overflow: ellipsis; 
    font-size: .6rem; 
  }
  [input] {
    text-align: left;
  }
  [output] {
    text-align: right;
  }
  [flex] {
    flex: 1 0 0;
  }
  [bar], [row], [column] {
    display: flex;
  }
  [column] {
    flex-direction: column;
  }
  [bar] {
    align-items: center;
  }
</style>

<div viewport on-wheel="onWheel">
  <canvas layer1 width="${viewport}" height="${viewport}"></canvas>
  <div layer0 on-mousedown="onAtomUnselect">
    <div repeat="atom_t">{{atoms}}</div>
  </div>
</div>

<template atom_t>
  <div atom column id="{{atomId}}" key="{{id}}" selected$="{{selected}}" xen:style="{{style}}" on-mousedown="onAtomSelect">
    <div type>{{type}}</div>
    <div name>{{displayName}}</div>
    <div io row>
      <div flex column repeat="socket_i_t">{{inputs}}</div>
      <div flex style="padding: 0 4px;"></div>
      <div flex column repeat="socket_o_t">{{outputs}}</div>
    </div>
  </div>
</template>

<template socket_i_t>
  <div bar title="{{title}}">
    <span dot left></span>
    <span input>{{name}}</span>
  </div>
</template>

<template socket_o_t>
  <div bar title="{{title}}" style="justify-content: right;">
    <span output>{{name}}</span>
    <span dot right></span>
  </div>
</template>

`;

customElements.define('atom-graph', AtomGraph);
