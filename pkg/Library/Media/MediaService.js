/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Resources} from './Resources.js';
//import {loadImage} from '../Media/ImageLoader.js';
// import {THREE} from '../../third-party/threejs/threejs-import.js';
// import * as tools from '../Shader/shader-tools.js';
const log = logf('Services:Media', '#79AEA3');

const {assign} = Object;
const dom = (tag, props, container) => (container ?? document.body).appendChild(assign(document.createElement(tag), props));
//const isImproperSize = (width, height) => (width !== 1280 && width !== 640) || (height !== 480 && height !== 720);

export const MediaService = class {
  static async allocateResource(app, atom, resource) {
    log('allocateResource');
    return Resources.allocate(resource);
  }
  static async allocateCanvas(app, atom, data) {
    log('allocateCanvas');
    const {width, height} = data;
    const canvas = dom('canvas', {style: `display: none; width: ${width || 640}px; height: ${height || 480}px;`});
    canvas.width = data.width || 640;
    canvas.height = data.height || 480;
    return Resources.allocate(canvas);
  }
  static async captureStream(app, atom, {frame, fps}) {
    const realCanvas = Resources.get(frame.canvas);
    const realStream = realCanvas.captureStream(30);
    return {id: Resources.allocate(realStream)};
  }
  static async sendStream(app, atom, {stream}) {
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
