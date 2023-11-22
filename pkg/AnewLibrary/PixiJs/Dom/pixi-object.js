/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../../Resources/Resources.js';
//import {Paths} from '../../CoreXenon/Reactor/Atomic/js/utils/paths.js';
//import {PIXI} from '../../PixiJs/Dom/pixi.js';
//import {arand, irand} from '../../CoreXenon/Reactor/Atomic/js/utils/rand.js';

const log = logf('DOM:PixiObject', 'beige', 'black');

//const assets = Paths.resolve('$xenon/Library/Assets');
//const kinds = ['stone_blue', 'stone_green', 'stone_pink', 'stone_yellow'];

// const [cols, rows] = [8, 8];
// const siz = 65, margin = 8;
// const v = 0.1;
// const scales = [1, 1.25];

export class PixiObject extends Xen.Async {
  static get observedAttributes() {
    return ['app', 'x', 'y', 's', 'r', 'z'];
  }
  get template() {
    return Xen.html``;
  }  
  _didMount() {
    this.originHost = this.getRootNode().host;
    this.originHost.style.pointerEvents = 'none';
  }
  update(inputs, state) {
    if (!state.app) {
      if (inputs.app && !state.app) {
        // register our PixiApp
        this.updateAppId(inputs, state);
      } else {
        const app = this.originHost?.parentElement?.shadowRoot?.querySelector('pixi-app')?.state?.app;
        if (app) {
          state.app = app;
          this.updateApp(inputs, state);
        }
      }
    } 
    if (state.app && state.app.renderer && state.app.renderer.height) {
      this.updateObject(inputs, state);
    } else {
      setTimeout(() => this.invalidate(), 100);
    }
  }
  updateObject({x, y, s, r, z}, {object, app}) {
    if (object && app.renderer) {
      if (x !== undefined) {
        object.x = x;
      }
      if (y !== undefined) {
        object.y = y;
      }
      if (s !== undefined) {
        object.scale = {x:s, y:s};
      }
      if (r !== undefined) {
        object.rotation = r;
      }
      if (z !== undefined) {
        object.zIndex = z;
      }
      app.stage?.sortChildren();
      //updateTransform();
    }
  }
  updateAppId(inputs, state) {
    state.app = Resources.get(inputs.app);
    //log('got app', appId, state.app);
    if (state.app) {
      this.updateApp(inputs, state);
    }
  }
  updateApp(inputs, state) {
    //state.container = new PIXI.Container();
    state.app.ticker.add(time => {
      if (state.object) {
        const bounds = state.object.getLocalBounds();
        const [width, height] = [Math.max(state.bounds?.width || 0, bounds.width), Math.max(state.bounds?.height || 0, bounds.height)];
        state.bounds = {width, height};
        this.updateAnimation({...inputs, time}, state);
      }
    });
  }
  recenterApp({x, y}, {object, app}) {
    const ar = 3/4;
    const {width, height} = app.renderer;
    let fittedWidth = width;
    let fittedHeight = ar * width;
    if (fittedHeight > height) {
      fittedHeight = height;
      fittedWidth = height / ar;
    }
    object.width = fittedWidth;
    object.height = fittedHeight;
    object.x = width/2;
    object.y = height/2;
  }
  updateAnimation({time, x, y}, {app, object, bounds}) {
    const s = this.s || 1;
    this.recenterApp({x, y}, {object, app});
  }
};

//customElements.define('pixi-sprite', PixiSprite);

