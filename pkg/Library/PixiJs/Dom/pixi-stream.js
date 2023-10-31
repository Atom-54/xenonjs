/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../../Media/Resources.js';
import {PIXI} from './pixi.js';

const log = logf('DOM:PixiStream', 'beige', 'black');

export class PixiStream extends Xen.Async {
  static get observedAttributes() {
    return ['app', 'stream'];
  }
  get template() {
    return Xen.html`
<style>:host {display: block}</style>
<video autoplay playsinline Xhidden></video>
    `;
  }
  _didMount() {
    this.video = this._dom.$('video');
  }
  update({app, stream}, state) {
    if (stream) {
      !state.stream && log('got stream', stream);
      state.stream = Resources.get(stream.id);
      this.video.srcObject = state.stream;
    }
    this.updateAppState({app}, state);
  }
  updateAppState({app}, state) {
    if (app && !state.app) {
      log('got app', app);
      state.app = Resources.get(app);
      if (state.app) {
        if (state.container) {
          app.stage.addChild(state.container);
        } else {
          Object.assign(state, this.initContainer(state.app));
        }
      }
    }
    if (!app && state.app) {
      log.warn('app disconnected')
      app.stage.removeChild(state.container);
    }
  }
  initContainer(app) {
    const texture = PIXI.Texture.from(this.video);
    const sprite = PIXI.Sprite.from(texture);
    sprite.width = 1280;
    sprite.height = 768;
    sprite.position.x = 640;
    sprite.anchor.x = 0.5;
    sprite.scale.x = -1;
    const container = new PIXI.Container();
    container.addChild(sprite);
    return {container, sprite, texture};
  }
};

customElements.define('pixi-stream', PixiStream);

