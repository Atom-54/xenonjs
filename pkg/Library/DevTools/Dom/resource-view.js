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
        const notCanvas = res?.localName !== 'canvas';
        const notStream = !(res instanceof MediaStream);
        const notObject = !notCanvas || !notStream;
        const isShaderJunk = !notObject && res?.camera;
        const isJSON = notObject && !isShaderJunk;
        const json = isJSON 
          ? JSON.stringify(res, null, '  ')
          : isShaderJunk
            ? 'Shader'
            : ''
          ;
        return {
          key: name,
          notCanvas,
          notStream,
          notObject,
          size: json?.length 
            ? `${json.length} bytes`
            : res?.width ? `(${res?.width} x ${res?.height})` 
            : ''
            ,
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
    border: 1px solid orange;
    margin: 12px;
    padding: 8px;
    width: 124px;
  }
  canvas, video {
    border: 1px solid purple;
    width: 120px;
    height: 90px;
    object-fit: contain;
  }
  pre {
    margin: 0;
    font-size: 6px;
    width: 120px;
    height: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  b {
    padding-bottom: 2px;
  }
  span {
    padding-top: 2px;
  }
  i {
    font-size: 0.75em;
  }
</style>
<!-- <data-explorer object="{{resources}}"></data-explorer> -->
<div repeat="resource_t">{{resources}}</div>
<template resource_t>
  <div resource>
    <b>{{typeof}}</b>
    <canvas hidden$="{{notCanvas}}" key$="{{key}}" xen:style="{{canvasRatio}}" width="120" height="90"></canvas>
    <video hidden$="{{notStream}}" srcobject="{{srcObject:stream}}" playsinline autoplay muted></video>
    <pre hidden$="{{notObject}}">{{json}}</pre>
    <span>{{size}}</span><i>{{key}}</i>
  </span>
</template>
`;
  }
}

customElements.define('resource-view', ResourceView);