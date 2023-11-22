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
    const {width: bwidth, height: bheight} = object.getLocalBounds();
    const {width, height} = app.renderer;
    if (width && height && bwidth && bheight) {
      let ar = width / height;
      let lbHeight, lbWidth;
      if (ar > 1) {
        ar = 1/ar;
        lbHeight = ar * bwidth;
        lbWidth = width;
        object.scale = {x:1, y:ar};
      } else {
        lbWidth = ar * bheight;
        lbHeight = height;
        object.scale = {x:ar, y:1};
      }
      // if (ar > 1) ar = 1 / ar;
      //const cx = width * ar / 2;
      //const cy = height * ar / 2;
      const mx =- (lbWidth - width) / 2;
      const my = (lbHeight - height) / 2;
      x = (x??0) + mx;
      y = (y??0) + my;
      //log.debug([lbWidth, width], [lbHeight, height], [mx, my]);
    }
    // if (x !== undefined) {
    //   object.x = x;
    // }
    // if (y !== undefined) {
    //   object.y = y;
    // }
  }
  updateAnimation({time, x, y}, {app, object, bounds}) {
    const s = this.s || 1;
    // TODO(sjmiles): measuring bad (caveat emptor)
    // nothing need be done if these haven't actually changed
    // const {offsetLeft: ox, offsetTop: oy, offsetWidth: ow, offsetHeight: oh} = this.originHost;
    // let {x: sx, y:sy } = app.stage.scale;
    // object position
    // const [x, y] = [ox, oy];
    // object.position = {x, y};
    // object size
    // const {width: tw, height: th} = bounds;
    // our 'automatic' size for designable DOM element
    // Object.assign(this.style, {
    //   display: `inline-block`,
    //   // left: `${x}px`,
    //   // top: `${y}px`,
    //   width: `${tw*s}px`,
    //   height: `${th*s}px`
    // });
    //
    // sprite scale adjusted for aspect ratio and stage scale
    //const ss = Math.min(ow / tw / sx, oh / th / sy) * s;
    //object.scale = {x: ss, y: ss};
    //object.scale = {x:s, y:s};
    this.recenterApp({x, y}, {object, app});
    //
    //console.log(this.getBoundingClientRect());
  }
};

//customElements.define('pixi-sprite', PixiSprite);

