/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';

const log = logf('DOM:node-graph', 'forestgreen');

const viewport = 4000;
const defaultSize = [200, 56];

export class NodeGraph extends Xen.Async {
  static get observedAttributes() {
    return ['graph', 'rects'];
  }
  get host() {
    return this;
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
    this.canvas = this.querySelector('canvas');
    this._rects = {};
  }
  render(inputs, state) {
    // inputs.graph is ad hoc, not really a graph
    // iterate graph nodes to find selection and ensure each rect exists
    let selected = this.validateGraphRects(inputs);
    //console.log(inputs.rects);
    // compute selectedKeys
    const selectedKeys = selected?.key ? [`${this.idPrefix}${selected.key}`] : null
    // covert rects into render model objects
    const rects = this.renderRects(inputs);
    //console.log(rects);
    // compute array of graphNodes to render
    const nodes = this.renderGraph(inputs);
    // NB: connectors are drawn after, via Canvas. See _didRender.
    state.didRender = {rects: inputs.rects, graph: inputs.graph};
    // complete render model
    return {selectedKeys, rects, nodes};
  }
  validateGraphRects(inputs) {
    inputs.rects = inputs.rects ?? this._rects;
    // ... not actually a 'Graph' graph, just a graph
    const {rects, graph} = inputs;
    // iterate graph nodes
    let selected = null;
    if (graph) {
      const nodes = [...graph.graphNodes].sort((a,b) => a.key?.localeCompare(b.key));
      nodes.forEach((n, i) => {
        // - calculate missing rect
        if (!rects[n.key]) {
          const {l, t, w, h} = this.geom(rects, n.key, i, n);
          rects[n.key] = {l, t, w, h};
        }
        // - calc a height based on # of connection points
        const autoHeight = (Math.max(n?.inputs.length, n?.outputs.length) || 2) * 20 + 36;
        rects[n.key].h = Math.max(autoHeight, rects[n.key].h);
        // - memoize selected node
        if (n.selected) {
          selected = n;
        }
      });
    }
    return selected;
  }
  // get the geometry information for rectangle `key` (with index i)
  geom(rects, key, i, node) {
    if (rects?.[key]) {
      const {l, t, w, h} = rects[key];
      const [w2, h2] = [w/2, h/2];
      return {x: l+w2, y: t+h2, l, t, r: l+w, b: t+h, w, h, w2, h2};
    } else {
      // calculate a default landing spot
      let [width, height] = defaultSize;
      const [cols, margin, ox, oy] = [3, 50, 116, 116];
      const p = i => ({
        x: (i%cols)*(width+margin) + ox,
        y: Math.floor(i/cols)*(128+margin) + 16*(i%2) + oy
      });
      const o = p(i); // % 3);
      const [w, h, w2, h2] = [width, height, width/2, height/2];
      return {x: o.x, y: o.y, l: o.x-w2, t: o.y-h2, r: o.x+w2, b: o.y+w2, w, h, w2, h2};
    }
  }
  renderRects({rects}) {
    return Object.entries(rects || []).map(([id, position]) => ({id, position}));
  }
  renderGraph({rects, graph}) {
    // compute array of graphNodes to render
    const renderNodes = (rects && graph?.graphNodes) ?? [];
    return renderNodes.map(n => this.renderGraphNode(n));
  }
  renderGraphNode({key, selected, color, bgColor, inputs, outputs, textSelected, ...etc}) {
    color ??= 'var(--xcolor-three)';
    bgColor ??= 'var(--xcolor-two)';
    const selectedColor = 'var(--xcolor-brand)';
    return {
      ...etc,
      key,
      selected,
      nodeId: `${this.idPrefix}${key}`,
      inputs: inputs?.map(({name, type}) => ({name, type, title: `${name}: ${type}`})),
      outputs: outputs?.map(({name, type}) => ({name, type, title: `${name}: ${type}`})),
      nameStyle: {
        borderRadius: '11px 11px 0 0',
        //borderColor: selected ? color : 'var(--theme-color-bg-1)',
        //background: selected ? color : bgColor,
      },
      style: {
        borderColor: selected ? selectedColor: color,
        //color, //: selected ? selectedColor : color,
        background: bgColor
      },
      inputStyle: {
        background: 'transparent',
        border: '2px solid transparent',
        borderRadius: '11px 11px 0 0',
        color: selected, // ? selectedColor : color,
        textAlign: 'center',
        width: '100%'
      },
      disableRename: Boolean(true) //Boolean(!textSelected && (key !== this.state.textSelectedKey))
    };
  }
  _didRender({}, {x, y, didRender: {graph, rects}}) {
    if (rects) {
      this.renderCanvas({graph, rects}, {x, y});
    }
  }
  renderCanvas({graph, rects}, {x, y}) {
    const ctx = this.canvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      //console.log('=');
      rects && graph.graphEdges?.map((edge, i) => {
        const spacing = 18;
        const margin = 11;
        //
        const i0 = graph.graphNodes.findIndex(({key}) => key === edge.from.id);
        const i0outs = graph.graphNodes[i0]?.outputs;
        const ii0 = i0outs?.findIndex(({name}) => name === edge.from.storeName);
        const ii0c =i0outs?.length / 2 - 0.5;
        //console.log('out', i0, ii0, ii0c, edge.from.storeName);
        const i0offset = spacing * (ii0-ii0c) + margin;
        const g0 = this.geom(rects, edge.from.id, i0);
        //
        const i1 = graph.graphNodes.findIndex(({key}) => key === edge.to.id);
        const i1ins = graph.graphNodes[i1]?.inputs;
        const ii1 = i1ins?.findIndex(({name}) => name === edge.to.storeName);
        const ii1c = i1ins?.length / 2 - 0.5;
        //console.log('in', i1, ii1, ii1c, edge.to.storeName);
        const i1offset = spacing * (ii1-ii1c) + margin;
        const g1 = this.geom(rects, edge.to.id, i1);
        //
        if (i0outs?.length && i1ins?.length) {
          const p0 = {x: g0.r - 1, y: g0.y + i0offset};
          const p1 = {x: g1.l + 1, y: g1.y + i1offset};
          const path = this.calcBezier(p0, p1);
          //this.curve(ctx, path);
          //const highlight = [[210, 210, 255], [255, 210, 210], [210, 255, 210]][i%3];
          const highlight = [[21, 100, 100], [100, 21, 21], [21, 100, 21]][i%3];
          this.laserCurve(ctx, path, highlight);
        }
      });
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
      ctx.lineWidth = i*2.2 + 1;
      ctx.strokeStyle = !i ? `rgba(${highlight[0]},${highlight[1]},${highlight[2]},1)` : `rgba(${highlight[0]},${highlight[1]},${highlight[2]},${0.25-0.06*i})`;
      ctx.moveTo(path[0], path[1]);
      ctx.bezierCurveTo(path[2], path[3], path[4], path[5], path[6], path[7]);
      ctx.stroke();
      ctx.closePath();
    }
  }
  onNodeSelect(event) {
    event.stopPropagation();
    this.key = event.currentTarget.key;
    if (this.key !== this.state.textSelectedKey) {
      delete this.state.textSelectedKey;
    }
    this.fire('node-selected');
  }
  onNodeUnselect(event) {
    this.key = null;
    delete this.state.textSelectedKey;
    this.fire('node-selected');
  }
  // called when user has changed a rectangle (high freq)
  onUpdateBox({currentTarget: {value: rect}}) {
    this.value = rect;
    this.rects[this.key] = rect;
    this.invalidate();
  }
  // called when committed a change to a rectangle (low freq)
  onUpdatePosition({currentTarget: {target, value: rect}}) {
    if (target?.key && rect) {
      this.key = target.key;
      this.value = rect;
      this.fire('node-moved');
    }
  }
  onNodeDblClicked(event) {
    this.state.textSelectedKey = this.key;
  }
  onRenameNode(event){
    const text = event.target.value.trim();
    if (text?.length > 0) {
      this.value = text;
      this.fire('node-renamed');
    }
    delete this.state.textSelectedKey;
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
  onPointerMove({eventlet}) {
    log(eventlet);
  }
}

const template = Xen.Template.html`
<style>
  [viewport] {
    position: relative;
    width: ${viewport}px;
    height: ${viewport}px;
  }
  [node] {
    position: absolute;
    min-width: 100px;
    min-height: 60px;
    /**/
    border-radius: 16px;
    border: 2px solid var(--xcolor-two);
    /**/
    font-weight: bold;
    cursor: pointer;
    opacity: 0.9;
  }
  input {
    font-size: 12px;
  }
  [node] span {
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
  }
  [node][selected] {
    box-shadow: 23px 23px 46px #bebebe08, -23px -23px 46px #dddddd08;
  }
  [node]:not([selected]) {
    /* box-shadow:  9px 9px 18px #cecece20, -9px -9px 18px #d2d2d220; */
  }
  /**/
  [layer0] {
    position: absolute;
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
  [layer0] [repeat] {
    color: var(--xcolor-three);
  }
  [layer0]:hover [repeat] {
    color: var(--xcolor-four);
  }
  [repeat="socket_i_t"] {
    margin-left: -10px;
    overflow: hidden;
  }
  [repeat="socket_o_t"] {
    margin-right: -10px;
    overflow: hidden;
  }
  [layer0] [dot] {
    transition: opacity 100ms ease-in-out;
    opacity: 0;
  }
  [layer0]:hover [dot] {
    opacity: 1;
  }
  [dot] {
    display: inline-block;
    width: 9px;
    height: 9px;
    background: #c1b8c3;
    border: 1px solid #33333380;
    border-radius: 50%;
    padding: 5px;
  }
  [bar] {
    padding: 3px;
  }
  [flex] {
    overflow: visible;
  }
  [input], [output] {
    overflow: hidden; 
    text-overflow: ellipsis; 
    font-size: 8px; 
  }
  [input] {
    padding-left: 3px; 
    text-align: left;
  }
  [output] {
    padding-right: 3px; 
    text-align: right;
  }
</style>

<div viewport XtabIndex="0" on-wheel="onWheel">
  <canvas layer1 width="${viewport}" height="${viewport}"></canvas>
  <div layer0 on-mousedown="onNodeUnselect">
    <container-layout
      rects="{{rects}}"
      readonly="true"
      selected="{{selectedKeys}}"
      on-position-changed="onUpdatePosition"
      on-update-box="onUpdateBox"
      on-delete="onNodeDelete"
      repeat="node_t"
    >{{nodes}}</container-layout>
  </div>
</div>

<template node_t>
  <div node flex column id="{{nodeId}}" key="{{key}}" selected$="{{selected}}" xen:style="{{style}}" on-mousedown="onNodeSelect">
    <div name xen:style="{{nameStyle}}" on-dblclick="onNodeDblClicked">
      <input xen:style="{{inputStyle}}" disabled$="{{disableRename}}" type="text" value="{{displayName}}" on-change="onRenameNode">
    </div>
    <div flex row>
      <div flex centering column repeat="socket_i_t">{{inputs}}</div>
      <div Xflex center row style="padding: 0 4px;"></div>
      <div flex centering column repeat="socket_o_t">{{outputs}}</div>
    </div>
  </div>
</template>

<template socket_i_t>
  <div bar title="{{title}}">
    <span dot></span>
    <span input>{{name}}</span>
  </div>
</template>

<template socket_o_t>
  <div bar title="{{title}}" style="justify-content: right;">
    <span output>{{name}}</span>
    <span dot></span>
  </div>
</template>

`;

customElements.define('node-graph', NodeGraph);
