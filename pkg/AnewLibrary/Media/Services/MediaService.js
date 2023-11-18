/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Resources} from '../../Resources/Resources.js';
//import {loadImage} from '../Media/ImageLoader.js';
// import {THREE} from '../../third-party/threejs/threejs-import.js';
// import * as tools from '../Shader/shader-tools.js';
const log = logf('Services:Media', '#79AEA3');

const {assign} = Object;
const dom = (tag, props, container) => (container ?? document.body).appendChild(assign(document.createElement(tag), props));
//const isImproperSize = (width, height) => (width !== 1280 && width !== 640) || (height !== 480 && height !== 720);

export const MediaService = class {
  static async allocateResource(host, resource) {
    log('allocateResource');
    return Resources.allocate(resource);
  }
  static async allocateCanvas(host, data) {
    log('allocateCanvas');
    const {width, height} = data ?? {width: 640, height: 480};
    const canvas = dom('canvas', {style: `display: none; width: ${width}px; height: ${height}px;`});
    canvas.width = width;
    canvas.height = height;
    return Resources.allocate(canvas);
  }
  static async captureStream(host, {frame, fps}) {
    const realCanvas = Resources.get(frame.canvas);
    const realStream = realCanvas.captureStream(30);
    return {id: Resources.allocate(realStream)};
  }
  static async sendStream(host, {stream}) {
    const realStream = Resources.get(stream.id);
    if (globalThis.sendXenonCameraStream && !MediaService.cameraStream) {
      MediaService.cameraStream = realStream;
      log('sendXenonCamerStream exists, got stream', realStream);
      if (realStream) {
        globalThis.sendXenonCameraStream(realStream);
      }
    }
  }
};
