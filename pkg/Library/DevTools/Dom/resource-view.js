/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {IconsCss} from '../../Dom/Material/material-icon-font/icons.css.js';
//import {Resources} from '../../Media/Resources.js';

const {entries} = Object;

export class ResourceView extends Xen.Async {
  static get observedAttributes() {
    return ['resources', 'version'];
  }
  update({resources}, state) {
    state.resources = resources || globalThis.Resources.all();
    state.canvases = entries(state.resources).filter(([name, res]) => res?.localName === 'canvas');
  }
  render({}, {resources}) {
    const cap = s => `${s[0].toUpperCase()}${s.slice(1)}`;
    return {
      resources: entries(resources).filter(([name, res]) => name && res).map(([name, res]) => {
        const notLayer = !res?.graph;
        const notCanvas = res?.localName !== 'canvas';
        const notStream = !(res instanceof MediaStream);
        const notShader = !res?.camera;
        const notPixiApp = !res?.stage;
        const notObject = !notCanvas || !notStream || !notShader || !notLayer || !notPixiApp;
        const json = notObject ? '' : JSON.stringify(res, null, '  ');
        const size = !notLayer
          ? 'Layer'
          : !notObject 
            ? `${json.length} bytes`
            : !notShader
              ? 'Shader' 
              : !notCanvas 
                ? `${res?.width} x ${res?.height}` 
                : ''
          ;
        return {
          key: name,
          notCanvas,
          notStream,
          notObject,
          size, 
          canvasRatio: `aspect-ratio: ${res?.width} / ${res?.height};`,
          typeof: res?.localName 
            ? cap(res.localName)
            // : (res instanceof MediaStream) ? 'Stream'
            // : (res?.sampleRate) ? 'Audio'
            : (res?.constructor?.name)
            ?? typeof(res)
            ,
          stream: (res instanceof MediaStream) ? res : null,
          json
        };
      })
    };
  }
  _didRender({}, {canvases}) {
    canvases?.map(([name, resource]) => {
      const previewCanvas = this.host.querySelector(`[key="${name}"]`);
      const ctx = previewCanvas?.getContext('2d');
      if (resource && resource.width) {
        const {width: w, height: h} = ctx.canvas;
        ctx.clearRect(0, 0, w, h);
        ctx?.drawImage(resource, 0, 0, w, h);
      } else {
        // make an X?
      }
    });
  }
  get template() {
    return Xen.Template.html`
<style>
  ${IconsCss}
  :host {
    display: block;
  }
  [resource] {
    display: inline-flex;
    flex-direction: column;
    border: 1px solid purple;
    margin: 8px;
    padding: 8px;
    width: 11em;
    line-height: 120%;
  }
  canvas, video {
    border: 1px solid orange;
    width: 11em;
    height: 8em;
    object-fit: contain;
    margin-bottom: 4px;
  }
  pre {
    margin: 0;
    font-size: 6px;
    width: 120px;
    height: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* b {
    padding-bottom: 2px;
  }
  span {
    padding-top: 2px;
  } */
  i {
    font-size: 0.75em;
  }
</style>
<!-- <data-explorer object="{{resources}}"></data-explorer> -->
<div repeat="resource_t">{{resources}}</div>
<template resource_t>
  <div resource>
    <div><b>{{typeof}}</b>&nbsp;<i>(<span>{{key}}<span>)</i>&nbsp;</div>
    <canvas hidden$="{{notCanvas}}" key$="{{key}}" xen:style="{{canvasRatio}}" width="120" height="90"></canvas>
    <video hidden$="{{notStream}}" srcobject="{{srcObject:stream}}" playsinline autoplay muted></video>
    <pre hidden$="{{notObject}}">{{json}}</pre>
    <span>{{size}}</span>
  </span>
</template>
`;
  }
}

customElements.define('resource-view', ResourceView);