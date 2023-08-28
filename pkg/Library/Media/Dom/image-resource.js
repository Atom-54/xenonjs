/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../Resources.js';

const template = Xen.Template.html`
<style>
  :host {
    overflow: hidden;
    font-size: 10px;
    color: black;
    background-color: black;
  }
  * {
    box-sizing: border-box;
  }
  canvas, img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
  [flip] {
    transform: scaleX(-1);
  }
  [show=false], [hide=true] {
    display: none !important;
  }
</style>

<img hide$="{{canvasNotImage}}" src="{{src}}" draggable="false" alt="{{alt}}">
<canvas show$="{{canvasNotImage}}"></canvas>

`;

const oneTransparentPixel = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==`;

export class ImageResource extends Xen.Async {
  static get observedAttributes() {
    return ['image', 'masks'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.canvas = this._dom.$('canvas');
    this.dimage = this._dom.$('img');
  }
  update({image, masks}, state, {service}) {
    let useMasks = masks;
    if (!useMasks && image?.masksResource) {
      useMasks = image;
    }
    if (useMasks) {
      this.updateMasks(useMasks, state);
    } else {
      this.updateImage(image, state);
    }
  }
  async updateMasks(masks, state) {
    if (masks !== state.masks) {
      state.masks = masks;
      const realMasks = Resources.get(masks?.masksResource);
      const mask = realMasks[0];
      if (mask) {
        state.canvas = await mask.toCanvasImageSource();
      }
    }
  }
  updateImage(image, state) {
    if (image !== state.image) {
      state.image = image;
      state.canvas = Resources.get(image?.canvas);
    }
  }
  render({image}, state) {
    const model = {};
    if (state.canvas && state.canvas.width && state.canvas.height) {
      this.canvas.width = state.canvas.width;
      this.canvas.height = state.canvas.height;
      this.canvas.getContext('2d').drawImage(state.canvas, 0, 0);
    } else {
      // TODO(sjmiles): seeing repeated Network hits when setting image.src = image.src,
      // so doing some jumping about here to avoid this (bogus) side-effect
      const src = image?.url; 
      if (src && state.src !== src) {
        model.src = state.src = src;
      }
      model.alt = image?.alt ?? '';
    }
    return {
      canvasNotImage: Boolean(state.canvas).toString(),
      ...model
    };
  }
  _didRender() {
    if (this.dimage) {
      this.dimage.src = oneTransparentPixel; //'../Apps/Assets/dogs.png'; 
      requestAnimationFrame(() => {
        if (this.state.src) {
          const image = new Image();
          image.src = this.state.src;
          image.decode();
          this.dimage.src = this.state.src;
        }
      });
    }
  }
}
customElements.define('image-resource', ImageResource);
