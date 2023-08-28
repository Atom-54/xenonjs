/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

const template = Xen.Template.html`
<style>
  :host {
    box-sizing: border-box;
    display: inline-flex;
    align-items: stretch;
  }
  div {
    flex: 1;
    transition: opacity 800ms ease-in;
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>

<div xen:style="{{style}}"></div>

`;

export class FancyImage extends Xen.Async {
  static get observedAttributes() {
    // setting these properties/attributes will automatically trigger `update(inputs)`
    // these are the names of fields in `inputs`
    return ['src', 'autosize'];
  }
  get template() {
    return template;
  }
  update({src}, state) {
    // grab up our image
    let {image} = state;
    if (!image) {
      // ok, then make one (this is not displayed anywhere)
      state.image = image = new Image();
      // tell us when stuff happens
      image.onload = this.onImageLoad.bind(this, state);
    }
    // if this isn't our current 'src'
    if (state.src !== src) {
      // make it our current 'src'
      state.src = src;
      // install it into the image
      image.src = src;
      // src is new, so it's not loaded yet (see onImageLoad)
      state.loadedSrc = null;
    }
  }
  onImageLoad({image: {src}}) {
    // the contents of this loadedSrc are now available in the image
    this.state = {loadedSrc: src};
  }
  render({autosize}, {loadedSrc, image}) {
    // I can't remember why we use backgroundImage instead of image
    const style = {
      backgroundImage: loadedSrc ? `url('${loadedSrc}')` : '',
      opacity: loadedSrc ? 1 : 0
    };
    if (autosize !== false && image) {
      const {width, height} = image;
      if (width && height) {
        style.width = `${width}px`;
        style.height = `${height}px`;
      }
    }
    return {style};
  }
}
