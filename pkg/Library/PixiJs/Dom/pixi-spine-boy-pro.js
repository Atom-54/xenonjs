/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {PIXI} from './pixi.js';

export class PixiSpineBoyPro extends Xen.Async {
  static get observedAttributes() {
    return ['app'];
  }
  // get template() {
  //   return Xen.html`<style>:host { display: none; }</style> `;
  // }
  update({app}, state) {
    if (!state.app && app) {
      state.app = Resources.get(app);
      this.initSpineBoy(state);
    }
  }
  async initSpineBoy(state) {
    state.boy = await SpineBoy(state.app);
    state.boy.tick = (elapsed) => this.tick(state.boy, elapsed, state.app.keys);
  }
  tick(boy, elapsed, keys) {
    const v = elapsed * 5;
    if (keys.ArrowUp) {
      //boy.spine.scale.x = 0.75;
      //boy.spine.x += boy.spine.scale.x * elapsed;
      boy.play('jump');
    } else if (keys.ArrowDown) {
      //boy.spine.scale.x = 0.75;
      //boy.spine.x += boy.spine.scale.x * elapsed;
      boy.play('aim');
      boy.play('shoot', 1);
    } else if (keys.ArrowLeft) {
      boy.spine.scale.x = -0.75;
      boy.spine.x -= v;
      boy.play('walk');
    } else if (keys.ArrowRight) {
      boy.spine.scale.x = 0.75;
      boy.spine.x += v;
      boy.play('walk');
    } else {
      boy.stop();
    }
  }
}
customElements.define('pixi-spine-boy-pro', PixiSpineBoyPro);

const SpineBoy = async (app) => {
  // load spine data
  const spineboyAsset = await PIXI.Assets.load(`../../third-party/pixijs/assets/pixi-spine/spineboy-pro.json`);
  // create a spine boy
  const spineBoyPro = new PIXI.spine.Spine(spineboyAsset.spineData);
  // set the position
  spineBoyPro.x = app.screen.width / 2;
  spineBoyPro.y = app.screen.height;
  spineBoyPro.scale.set(0.75);
  app.stage.addChildAt(spineBoyPro, 1);
  //app.stage.addChild(spineBoyPro);
  //
  const singleAnimations = ['aim', 'death', 'jump', 'portal', 'shoot'];
  const loopAnimations = ['hoverboard', 'idle', 'run', 'walk']; //, 'shoot'
  const allAnimations = [].concat(singleAnimations, loopAnimations);
  //
  let lastAnimation = '';
  const boy = {
    spine: spineBoyPro,
    play: (animation, track=0) => {
      if (lastAnimation !== animation) {
        lastAnimation = animation;
        spineBoyPro.state.setAnimation(track, animation, loopAnimations.includes(animation));
      }
    },
    stop: () => {
      lastAnimation = null;
      // if (lastAnimation) {
      //   spineBoyPro.state.setAnimation(0, lastAnimation, true, 0);
      // }
      //spineBoyPro.state.addEmptyAnimation(0, 1.5, 0);
      spineBoyPro.state.setEmptyAnimation(0, 0.5, 0);
    },
    animate: () => {
      let animation = '';
      do {
        animation = allAnimations[Math.floor(Math.random() * allAnimations.length)];
      } while (animation === lastAnimation);
      spineBoyPro.state.setAnimation(0, animation, loopAnimations.includes(animation));
      lastAnimation = animation;
    }
  };
  //
  app.ticker.add(delta => boy.tick?.(delta));
  //
  return boy;
};
