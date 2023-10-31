/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Resources} from './Resources.js';

const log = logf('Service:Image', 'coral');

const {assign} = Object;
const dom = (tag, props, container) => (container ?? document.body).appendChild(assign(document.createElement(tag), props));

export const ImageService = {
  async ResizeImage(app, atom, {image, size}) {
    if (!image.canvas) {
      image = await ImageService.requireImageCanvas(app, atom, {image});
    }
    const {width, height} = size;
    const realCanvas = Resources.get(image.canvas);
    const resizeCanvas = dom('canvas', {width, height, style: 'display: none;'});
    const ctx = resizeCanvas.getContext('2d');
    ctx.drawImage(realCanvas, 0, 0, width, height);
    Resources.set(image.canvas, resizeCanvas);
    image.url = resizeCanvas.toDataURL();
    return image;
  },
  async clearCanvas(layer, atom, {canvas, op, fillStyle, alpha}) {
    const realCanvas = Resources.get(canvas);
    const ctx = realCanvas.getContext('2d');
    ctx.globalAlpha = alpha || 1;
    ctx.globalCompositeOperation = op || 'copy';
    ctx.fillStyle = fillStyle || 'transparent';
    ctx.fillRect(0, 0, realCanvas.width, realCanvas.height);
  },
  async requireImageCanvas(app, atom, {image}) {
    image.canvas = await ImageService.canvasFromImage(app, atom, image);    
    return image;
  },
  async canvasFromImage(app, atom, {url}) {
    log('canvasFromImage, url = ', url?.slice(0, 80));
    const image = await loadImage(url);
    const id = await allocateCanvas();
    imageToCanvas(image, id);
    return id;
  },
  async drawImage(app, atom, {source, target, dx, dy, dw, dh, operation}) {
    const realTarget = Resources.get(target);
    const realSource = Resources.get(source);
    if (realTarget && realSource) {
      let args = [dx ?? 0, dy ?? 0];
      if (dw && dh) {
        args = [...args, dw, dh];
      }
      const ctx = realTarget.getContext('2d');
      ctx.globalCompositeOperation = operation ?? 'source-over';
      ctx.drawImage(realSource, ...args);
    }
  },
  async compose(app, atom, {images, operations, canvasOut}) {
    const canvii = images.map(image => image?.canvas);
    const realIn = canvii.map(id => id && Resources.get(id));
    // target
    const realOut = Resources.get(canvasOut);
    // need at least image0 and realOut to exist
    if (realIn[0] && realOut) {
      // image0 dictates output size 
      const {width: dw, height: dh} = realIn[0];
      // no size, no activity
      if (dw && dh) {
        if (realOut.width !== dw || realOut.height != dh) {
          realOut.width = dw;
          realOut.height = dh;
        }
        // prepare target
        const ctx = realOut.getContext('2d');
        // compose canvas layers via operations
        realIn.filter(c=>c).forEach((realCanvas, i) => {
          ctx.globalCompositeOperation = operations?.[i] ?? (i ? 'source-over' : 'copy');
          if (realCanvas) {
            ctx.drawImage(realCanvas, 0, 0, dw, dh);
          }
        });
      }
    }
  }
};

const loadImage = async src => {
  return src && new Promise(resolve => {
    const img = new Image();
    //img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    setTimeout(() => resolve(img), 3000);
    img.src = src;
  });
};

const allocateCanvas = async size => {
  log('allocateCanvas');
  const {width, height} = size ?? {width: 240, height: 180};
  const canvas = dom('canvas', {width, height, style: 'display: none;'});
  return Resources.allocate(canvas);
};

const imageToCanvas = (image, canvasId) => {
  if (image?.width && image?.height) {
    const {width, height} = image;
    const canvas = Resources.get(canvasId);
    assign(canvas, {width, height});
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
  }
};
  