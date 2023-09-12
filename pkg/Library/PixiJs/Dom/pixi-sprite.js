/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Paths} from '../../CoreReactor/Atomic/js/utils/paths.js';
import {PIXI} from '../../PixiJs/Dom/pixi.js';
import {PixiObject} from './pixi-object.js';

const log = logf('DOM:PixiSprite', 'beige', 'black');

const assets = Paths.resolve('$xenon/Library/Assets');

export class PixiSprite extends PixiObject {
  static get observedAttributes() {
    return ['app', 'from', 'x', 'y', 's', 'r'];
  }
  update(inputs, state) {
    super.update(inputs, state);
    if (state.app) {
      this.updateSprite(inputs, state);
    }
  }
  updateSprite(inputs, state) {
    if (state.from !== inputs.from) {
      if (state.object) {
        log('rebuilding Sprite...');
        state.app.stage.removeChild(state.object);
        state.object.destroy();
      }
      state.object = this.makeSprite(inputs.from ?? `${assets}/gems/scene.png`)
      state.app.stage.addChild(state.object);
    }
    state.from = inputs.from;
  }
  makeSprite(from) {
    const ori = {x:0, y:0};
    const haf = {x:0.5, y:0.5};
    const uni = {x:1, y:1};
    const sprite = PIXI.Sprite.from(from);
    sprite.pivot = haf;
    sprite.anchor = ori;
    sprite.scale = uni;
    sprite.visible = true;
    return sprite;
  }
};

customElements.define('pixi-sprite', PixiSprite);

