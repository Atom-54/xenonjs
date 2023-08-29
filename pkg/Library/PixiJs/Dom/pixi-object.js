/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../../Media/Resources.js';
//import {Paths} from '../../CoreReactor/Atomic/js/utils/paths.js';
import {PIXI} from '../../PixiJs/Dom/pixi.js';
//import {arand, irand} from '../../CoreReactor/Atomic/js/utils/rand.js';

const log = logf('DOM:PixiObject', 'beige', 'black');

//const assets = Paths.resolve('$xenon/Apps/Assets');
//const kinds = ['stone_blue', 'stone_green', 'stone_pink', 'stone_yellow'];

// const [cols, rows] = [8, 8];
// const siz = 65, margin = 8;
// const v = 0.1;
// const scales = [1, 1.25];

export class PixiObject extends Xen.Async {
  static get observedAttributes() {
    return ['app', 'x', 'y', 's', 'r'];
  }
  get template() {
    return Xen.html``;
  }  
  _didMount() {
    this.state.originHost = this.getRootNode().host;
  }
  update(inputs, state) {
    if (inputs.app && !state.app) {
      // register our PixiApp
      this.updateAppId(inputs, state);
    }
    this.updateObject(inputs, state);
  }
  updateObject({x, y, s, r}, state) {
    const {object} = state;
    if (object) {
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
    state.container = new PIXI.Container();
    state.app.ticker.add(time => {
      if (state.object) {
        const bounds = state.object.getLocalBounds();
        const [width, height] = [Math.max(state.bounds?.width || 0, bounds.width), Math.max(state.bounds?.height || 0, bounds.height)];
        state.bounds = {width, height};
        this.updateAnimation({...inputs, time}, state);
      }
    });
  }
  updateAnimation({time}, {originHost, app, object, bounds}) {
    // TODO(sjmiles): measuring bad (caveat emptor)
    // nothing need be done if these haven't actually changed
    const {offsetLeft: ox, offsetTop: oy, offsetWidth: ow, offsetHeight: oh} = originHost;
    const {x: sx, y:sy } = app.stage.scale;
    //
    // sprite position adjusted for stage scale
    const [x, y] = [ox / sx, oy / sy];
    object.position = {x, y};
    //
    // our sprite resolution
    const {width: tw, height: th} = bounds; //object.getLocalBounds(); //object.texture;
    const s = Math.min(ow / tw / sx, oh / th / sy);
    //
    // our 'automatic' size
    Object.assign(this.style, {
      display: `inline-block`,
      width: `${tw*sx}px`,
      height: `${th*sy}px`
    });
    // sprite scale adjusted for aspect ratio and stage scale
    object.scale = {x: s, y: s};
    //
    //console.log(this.getBoundingClientRect());
  }};

//customElements.define('pixi-sprite', PixiSprite);

