/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../../Media/Resources.js';
import {Paths} from '../../CoreXenon/Reactor/Atomic/js/utils/paths.js';
import {PIXI} from './pixi.js';

const log = logf('DOM:PixiNuPogodi', 'beige', 'black');

const assets = Paths.resolve('$xenon/Library/Assets');

export class PixiNuPogodi extends Xen.Async {
  static get observedAttributes() {
    return ['app'];
  }
  get template() {
    return Xen.html`
<style>:host {display: none}</style>
    `;
  }
  _didMount() {
  }
  update({app}, state) {
    if (app && !state.app) {
      log('got app', app);
      state.app = Resources.get(app);
      if (state.app) {
        Object.assign(state, this.initContainer(state.app));
      }
    }
    if (state.app) {
      setTimeout(() => this.invalidate(), Math.random() * 300 + 300);
      this.direct(Math.random() < 0.5, Math.random() < 0.5, state);
      //this.flippit(state);
    }
  }
  direct(leftOrNot, topOrNot, {wolfL, wolfR, basketLT, basketLB, basketRT, basketRB}) {
    wolfL.visible = leftOrNot;
    basketLT.visible = leftOrNot && topOrNot;
    basketLB.visible = leftOrNot && !topOrNot;
    wolfR.visible = !leftOrNot;
    basketRT.visible = !leftOrNot && topOrNot;
    basketRB.visible = !leftOrNot && !topOrNot;
  }
  initContainer(app) {
    //app.renderer.background.color = 0xFFFFFF;
    const container = new PIXI.Container();
    const overlap = name => {
      const sprite = PIXI.Sprite.from(`${assets}/${name}.png`);
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 1.5;
      sprite.position.x = 640;
      sprite.position.y = 768;
      sprite.scale.x = 0.5;
      sprite.scale.y = 0.5;
      container.addChild(sprite);
      return sprite;
    }
    const bg = overlap('background');
    bg.anchor.y = 1.075;
    bg.scale.y = 0.5;
    const wolfL = overlap('wolfL');
    const wolfR = overlap('wolfR');
    const basketLT = overlap('basketLT');
    const basketLB = overlap('basketLB');
    const basketRT = overlap('basketRT');
    const basketRB = overlap('basketRB');
    app.stage.addChildAt(container, 0);
    return {container, wolfL, wolfR, basketLT, basketLB, basketRT, basketRB};
  }
};

customElements.define('pixi-nu-pogodi', PixiNuPogodi);

