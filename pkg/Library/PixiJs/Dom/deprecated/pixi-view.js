/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../../Media/Resources.js';
import {Paths} from '../../CoreXenon/Reactor/Atomic/js/utils/paths.js';
import {PIXI} from './pixi.js';

const assets = Paths.resolve('$library/../third-party/pixijs/old/assets');

export class PixiView extends Xen.Async {
  static get observedAttributes() {
    return ['demo', 'image'];
  }
  get template() {
    return Xen.html`
<style>
  canvas {
    width:100%;
    height:100%;
  }
</style>
<!-- <canvas issamine></canvas> -->
    `;
  }
  _didMount() {
    this.addEventListener('click', () => {
      this.state.boy?.animate();
    });
    // this.canvas = this._dom.$('canvas');
  }
  update({demo, image}, state) {
    // let demoName = demo;
    // const demos = {
    //   Spiral,
    //   Shader,
    //   BlendMode,
    //   Transparent,
    //   Tinting,
    //   CacheAsBitmap,
    //   ImageTexture,
    //   SpineBoy
    // };
    //
    // if (image && !demoName) {
    //   if (!state.image || !deepEqual(state.image, image)) {
    //     const realCanvas = Resources.get(image.canvas);
    //     if (realCanvas) {
    //       demoName = 'ImageTexture';
    //       state.image = image;
    //       state.canvas = realCanvas;
    //     }
    //   }
    // }
    //
    // if (state.app && demoName !== state.demo) {
    //   state.app.destroy(true);
    //   state.app = null;
    // }
    //
    if (!state.app /*&& demoName*/) {
      //state.demo = demoName;
      //const demoFunc = demos[demoName];
      //if (demoFunc) {
        const app = new PIXI.Application({
          width: 1280, height: 720,
          //width: 800, height: 600,
          // view: this.canvas,
          //forceCanvas: true,
          //backgroundAlpha: (demoFunc === Transparent) ? 0 : 1
        });
        state.app = app;
        this.host.appendChild(app.view);
        //
        SpineBoy(app, state);
        //
        const sprite = PIXI.Sprite.from(`${assets}/rt_object_02.png`);
        app.stage.addChild(sprite);
        //
        let elapsed = 0.0;
        app.ticker.add(delta => {
          elapsed += delta;
          // Update the sprite's X position based on the cosine of our elapsed time.  We divide
          // by 50 to slow the animation down a bit...
          sprite.anchor.set(0.5);
          sprite.x = 200.0 + Math.cos(elapsed/50.0) * 100.0;
          sprite.y = 200.0 + Math.sin(elapsed/50.0) * -20.0;
          sprite.angle = elapsed;
          //sprite.alpha = 0.5;
        });
    }
    //
    // if (state.appCanvasId) {
    //   setTimeout(() => this.invalidate(), 16);
    //   this.value = {canvas: state.appCanvasId, version: Math.random()};
    //   this.fire('image');
    // }
  }
}

customElements.define('pixi-view', PixiView);

const SpineBoy = async (app, state) => {
  // load spine data
  const spineboyAsset = await PIXI.Assets.load(`../../third-party/pixijs/assets/pixi-spine/spineboy-pro.json`);
//   //app.stage.interactive = true;
  // create a spine boy
  const spineBoyPro = new PIXI.spine.Spine(spineboyAsset.spineData);
  // set the position
  spineBoyPro.x = app.screen.width / 2;
  spineBoyPro.y = app.screen.height;
  spineBoyPro.scale.set(0.5);
  app.stage.addChild(spineBoyPro);
  const singleAnimations = ['aim', 'death', 'jump', 'portal'];
  const loopAnimations = ['hoverboard', 'idle', 'run', 'shoot', 'walk'];
  const allAnimations = [].concat(singleAnimations, loopAnimations);
  let lastAnimation = '';
  // Press the screen to play a random animation
  state.boy = {
    animate: () => {
      let animation = '';
      do {
        animation = allAnimations[Math.floor(Math.random() * allAnimations.length)];
      } while (animation === lastAnimation);
      spineBoyPro.state.setAnimation(0, animation, loopAnimations.includes(animation));
      lastAnimation = animation;
    }
  };
};
