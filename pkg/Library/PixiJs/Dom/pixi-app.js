/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../../Media/Resources.js';
//import {Paths} from '../../CoreXenon/Reactor/Atomic/js/utils/paths.js';
import {PIXI} from './pixi.js';

//const assets = Paths.resolve('$xenon/third-party/pixijs/old/assets');

//const stageWidth = 1024;
const stageRes = [1024, 768];

export class PixiApp extends Xen.Async {
  static get observedAttributes() {
    return ['active'];
  }
  get template() {
    return Xen.html`
<style>
  :host {
    overflow: hidden;
  }
</style>
`;
  }
  _didMount() {
    this.tabIndex ??= 1;
    this.tabIndex = 1;
    const keys = this.state.keys = {};
    const emitter = window; //this;
    emitter.addEventListener('keydown', ({key}) => {
      if (!keys[key]) {
        keys[key] = true;
      }
    });
    emitter.addEventListener('keyup', ({key}) => {
      if (keys[key]) {
        keys[key] = false;
      }
    });
    const ro = new ResizeObserver(() => this.onresize(this.state));
    ro.observe(this);
  }
  onresize(state) {
    //console.log(this.clientHeight, this.clientWidth);
    if (this.clientHeight !== state.height || this.clientWidth !== state.width) {
      state.height = this.clientHeight;
      state.width = this.clientWidth;
      // if (!this.resizer) {
      //   this.resizer = setTimeout(() => {
        this.doresize(state.app);
        //console.log(this.clientHeight, this.clientWidth);
        //setTimeout(() => this.doresize(state.app), 100);
        //   this.resizer = null;
        // }, 100);
      //}
    }
  }
  doresize(app) {
    // resize the target Canvas to cover app
    const [width, height] = [this.clientWidth, this.clientHeight];
    app.renderer.resize(width, height);
    // our stage resolution
    //const [rw, rh] = [stageWidth, stageWidth * height / width];
    const [rw, rh] = stageRes;
    // our stage scale
    //const [sw, sh] = [width/rw, height/rh]; //Mth.min(width/sw, height/sh);
    const ss = Math.min(width/rw, height/rh);
    app.stage.scale = {x: ss, y: ss};
    // our stage bounds
    // const rect = app.stage.getLocalBounds();
    // // center
    // app.stage.x = (rw - rect.width) * ss / 2;
    // app.stage.y = (rh - rect.height) * ss / 2;
    // console.log(app.stage.x, app.stage.y);
  }
  update({active}, state) {
    if (!state.app) {
      const app = state.app = this.createApp(state.keys);
      globalThis.pxapp = app;
      this.value = state.canvasId = Resources.allocate(app.view);
      this.fire('canvas');
      this.value = state.appId = Resources.allocate(app);
      this.fire('appid');
      setTimeout(() => this.onresize(this.state), 100);
    }
    if (state.app) {
      state.app[active ? 'start' : 'stop']() 
    //   console.log(this.offsetLeft, this.offsetTop);
    //   state.app.stage.x = this.offsetLeft;
    //   state.app.stage.y = this.offsetTop;
    //   state.app.view.style.cssText = `position: absolute; left: -${this.offsetLeft}px; top: -${this.offsetTop}px`;
    }
  }
  createApp(keys) {
    const app = new PIXI.Application({
      //resizeTo: this,
      width: 640,
      height: 480,
      //width: 960, height: 720,
      //width: 600, height: 800,
      //view: this.canvas,
      //forceCanvas: true,
      //backgroundAlpha: (demoFunc === Transparent) ? 0 : 1
      backgroundAlpha: 0,
      eventMode: 'passive'
    });
    app.stage.sortableChildren = true;
    //app.renderer.background.color = 'tran';
    // app.stage.width = 300;
    // app.stage.height = 400;
    app.keys = keys;
    this.host.appendChild(app.view);
    return app;
  }
};

customElements.define('pixi-app', PixiApp);

