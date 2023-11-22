/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Paths} from '../../Xenon/Utils/paths.js';
import {PixiObject} from './pixi-object.js';
import {PIXI} from './pixi.js';

const log = logf('DOM:PixiSprite', 'beige', 'black');

const assets = Paths.resolve('$xenon/Library/Assets');

export class PixiSprite extends PixiObject {
  static get observedAttributes() {
    return [...PixiObject.observedAttributes, 'from'];
  }
  // update(inputs, state) {
  //   super.update(inputs, state);
  //   if (state.app) {
  //     this.updateSprite(inputs, state);
  //   }
  // }
  updateObject(inputs, state) {
    this.updateSprite(inputs, state);
    super.updateObject(inputs, state);
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
    const center = {x:0.5, y:0.5};
    const uni = {x:1, y:1};
    const sprite = PIXI.Sprite.from(from);
    sprite.pivot = center;
    sprite.anchor = center;
    sprite.scale = uni;
    sprite.visible = true;
    return sprite;
  }
};

customElements.define('pixi-sprite', PixiSprite);

