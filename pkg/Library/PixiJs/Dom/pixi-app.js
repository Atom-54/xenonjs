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
    // this.addEventListener('pixi-hello', e => {
    //   console.warn(e.type, e);
    // });
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
    // match app view to client (Pixi resizer is 'window only' we have ResizeObserver)
    //let [width, height] = [this.clientWidth, this.clientHeight];
    const rect = this.getBoundingClientRect();
    // note: setting app.view size directly doesn't do what we want,
    // but resizing the renderer will size app.view correctly
    app.renderer.resize(rect.width, rect.height);
    // our stage resolution
    const [resw, resh] = [640, 880];
    // use stage.scale because the stage height/width depends on content
    const scale = Math.min(rect.width/resw, rect.height/resh);
    app.stage.scale = {x: scale, y: scale};
    // TODO(sjmiles): does nothing
    //log(app.stage.position);
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
      resizeTo: this,
      //width: 960, height: 720,
      //width: 600, height: 800,
      //view: this.canvas,
      //forceCanvas: true,
      //backgroundAlpha: (demoFunc === Transparent) ? 0 : 1
      backgroundAlpha: 0,
      eventMode: 'passive'
    });
    //app.renderer.background.color = 'tran';
    // app.stage.width = 300;
    // app.stage.height = 400;
    app.keys = keys;
    this.host.appendChild(app.view);
    return app;
  }
};

customElements.define('pixi-app', PixiApp);

