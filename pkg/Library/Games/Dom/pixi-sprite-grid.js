/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Paths} from '../../CoreXenon/Reactor/Atomic/js/utils/paths.js';
import {PIXI} from '../../PixiJs/Dom/pixi.js';
import {arand, irand} from '../../CoreXenon/Reactor/Atomic/js/utils/rand.js';
import {PixiObject} from '../../PixiJs/Dom/pixi-object.js';

// const log = logf('DOM:PixiSpriteGrid', 'beige', 'black');

const assets = Paths.resolve('$xenon/Library/assets/gems');

const [cols, rows] = [8, 8];
const siz = 65, margin = 8;
const v = 0.1;
const scales = [1, 1]; //[1, 1.25];

export class PixiSpriteGrid extends PixiObject {
  //   static get observedAttributes() {
  //     return [...PixiObject.observedAttributes, 'other'];
  //   }
  updateApp(inputs, state) {
    super.updateApp(inputs, state);
    state.object = this.initContainer(state.app);
    state.gems = this.constructGems(state.object);
    state.sparkle = this.constructSparkle(state.object);
    globalThis.gems = state.gems;
  }
  updateAnimation(inputs, state) {
    super.updateAnimation(inputs, state);
    // if (inputs.time - 1 > 0.1) {
    //   console.log('frame-time overrun:', inputs.time);
    // }
    this.updateGems(state);
    this.updateSparkle(state.sparkle);
  }
  updateGems({gems, object}) {
    // global scales
    const [s0, s1] = scales;
    // frame count for this `gems`
    const frame = gems.frame = (gems.frame || 0) + 1;
    // process gems
    gems.forEach((gem) => {
      this.scaleAndPositionGem(gem);
      // this is the PIXI.Sprite
      const {s} = gem;
      // reset scale to #0
      //s.scale = {x: s0, y: s0};
      // get pixel location for this gem
      //const [ix, jy] = this.ijToXy(gem.l, gem.t, gem.ol, gem.ot);
      //s.position = {x: ix, y: jy};
      // gems in motion have non-zero [ol,ot]
      if (gem.ol || gem.ot) {
        // gems in motion get scale #1
        s.scale = {x: s1, y: s1};
        // auto-drifting?
        if (!gem.manual) {
          // drift back to center (x-axis)
          const signl = Math.sign(gem.ol);
          const ol = gem.ol - v*signl;
          // stop at zero-crossing
          gem.ol = Math.sign(ol) === signl ? ol : 0;
          // drift back to center (y-axis)
          const signt = Math.sign(gem.ot);
          const ot = gem.ot - v*signt;
          // stop at zero-crossing
          gem.ot = Math.sign(ot) === signt ? ot : 0;
        }
      }
      // rotate rotate-y gems
      if (gem.rotate) {
        const scalar = 4;
        s.rotation = ((frame * scalar) % 360) * Math.PI / 180;
      }
      // pulsate pulse gems
      if (gem.pulse) {
        s.scale.x = s.scale.y = Math.sin(frame * 0.08) * 0.2 + 1.3;
      }
      // random motion effect
      // if (gem.ol === 0 && gem.ot === 0 && Math.random() < 0.002) {
      //   gem.ol = (Math.round(Math.random()) * 2 - 1) * 0.99;
      //   gem.ot = (Math.round(Math.random()) * 2 - 1) * 0.99;
      // }
    });
    // random explosion effect
    //   if (Math.random() < 1e-1) {
    //     this.explodeGem(gems, object);
    //   }
  }
  updateSparkle({s}) {
    if (s.alpha) {
      s.alpha = Math.max(0, s.alpha - 0.1);
    } else if (Math.random() < 0.2) {
      const i = Math.floor(Math.random() * 8);
      const j = Math.floor(Math.random() * 8);
      const [x,y] = this.ijToXy(i, j, 0, 0);
      s.position.x = x;
      s.position.y = y;
      s.alpha = 0.85;      
    }
  }
  explodeGem(gems, object) {
    let [l, t, dl, dt] = [irand(cols), irand(rows), 0, -1];
    for (let j=t; j>0; j--) {
      const i = l + j*cols;
      const slot = gems[i];
      this.moveGem(slot, dl, dt, gems);
    }
    //
    gems[l].rotate = true;
    gems[l+cols].rotate = false;
    //
    const gem = gems[l];
    gem.s.destroy();
    const {k, s} = this.configureGem(l, object);
    s.gemdex = l;
    gem.k = k;
    gem.s = s;
    this.scaleAndPositionGem(gem);
  }
  pointerDown(e, gems) {
    //console.log(e.target.gemdex);
    const gem = gems[e.currentTarget.gemdex];
    if (gem) {
      this.dragging = gem;
      gem.manual = true;
      //gem.s.onpointermove = e => this.pointerMove(e, gems);
      this.pointerMove(e);
    }
  }
  pointerMove(e) {
    const gem = this.dragging;
    if (gem) {
      gem.s.parent.setChildIndex(gem.s, 63);
      let [ol, ot, mol, mot] = this.calcDragOffset(gem, e);
      //console.log(ol, ot, mol, mot);
      if (mot + mol > 0.2) {
        if (mot > mol) {
          ol = (mol/mot < 0.3) ? 0 : Math.sign(ol) * Math.abs(ot);
        } 
        else if (mol > mot) {
          ot = (mot/mol < 0.3) ? 0 : Math.sign(ot) * Math.abs(ol);
        }
      }
      gem.ol = ol;
      gem.ot = ot;
    }
  }
  pointerUp(e, gems) {
    const gem = this.dragging;
    this.dragging = null;
    if (gem) {
      gem.manual = false;
      const [mol, mot] = [gem.ol*gem.ol, gem.ot*gem.ot];
      //let [ol, ot, mol, mot] = this.calcDragOffset(gem, e);
      if (mol+mot > 0.7) {
        const [dl, dt] = [Math.sign(gem.ol), Math.sign(gem.ot)];
        this.moveGem(gem, dl, dt, gems);
      }
    }
  }
  calcDragOffset({l, t}, e) {
    const {x: sx, y: sy} = this.state.app.stage.scale;
    const [px, py] = [e.x / sx, e.y / sy];
    const [x, y] = this.ijToXy(l, t, 0, 0);
    const [dx, dy] = [px - x, py - y];
    const clamp = v => Math.max(Math.min(v, 0.99), -0.99);
    let [ol, ot] = [clamp(dx / siz), clamp(dy / siz)];
    let [mol, mot] = [ol*ol, ot*ot];
    return [ol, ot, mol, mot];
  }
  constructSparkle(object) {
    const s = this.makeSprite(`${assets}/sparkles.png`);
    object.addChild(s);
    s.alpha = 0;
    //s.blendMode = PIXI.BLEND_MODES.SCREEN;
    return {s};
  }
  makeSprite(from) {
    const sprite = PIXI.Sprite.from(from);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.visible = true;
    sprite.scale.x = 1;
    sprite.scale.y = 1;
    return sprite;
  }
  moveGem(gem, dl, dt, gems) {
    const {l, t} = gem;
    const i = l + t*cols;
    if (/*!gem.ol && !gem.ot &&*/ (dl || dt)) {
      const nl = l+dl, nt = t+dt;
      if (nl >= 0 && nl < cols && nt >= 0 && nt < rows) {
        const other = gems[nl + nt*cols];
        //
        // swap properties
        const {s, rotate, pulse, k} = gem;
        gem.k = other.k;
        gem.s = other.s;
        gem.rotate = other.rotate;
        gem.pulse = other.pulse;
        //
        other.k = k;
        other.s = s;
        other.rotate = rotate;
        other.pulse = pulse;
        //
        other.s.gemdex = gem.s.gemdex;
        gem.s.gemdex = i;
        //
        // position for sliding
        other.ot = dt < 0 ? 0.999 : dt > 0 ? -0.999 : 0;
        other.ol = dl < 0 ? 0.999 : dl > 0 ? -0.999 : 0;
        gem.ot = -other.ot;
        gem.ol = -other.ol;
      }
    }
  }
  initContainer(app) {
    //app.renderer.background.color = 0xFFFFFF;
    const container = new PIXI.Container();
    app.stage.addChildAt(container, 0);
    container.eventMode = 'auto';
    //
    // const bg = PIXI.Sprite.from(`${assets}/scene.png`)
    // container.addChild(bg);
    //
    container.onpointerup = e => this.pointerUp(e, gems);
    container.onpointerupoutside = e => this.pointerUp(e, gems);
    container.onpointermove = e => this.pointerMove(e, gems);
    return container;
  }
  constructGems(container) {
    const gems = [];
    for (let i=0; i<rows*cols; i++) {
      const {k, s} = this.configureGem(i, container);
      gems[i] = this.makeGem(i, k, s);
    }
    return gems;
  }
  configureGem(i, container) {
    const kinds = ['stone_blue', 'stone_green', 'stone_pink', 'stone_yellow'];
    const k = arand(kinds);
    const s = this.makeSprite(`${assets}/${k}.png`);
    const rn = Math.random();
    if (rn < 0.05) {
      s.filters = [new PIXI.BlurFilter()];
    } else if (rn < 0.10) {
      const f = new PIXI.NoiseFilter(0.3, Math.random());
      f.blendMode = PIXI.BLEND_MODES.ADD;
      s.filters = [f];
    } else if (rn < 0.15) {
      const filter = new PIXI.ColorMatrixFilter();
      //filter.lsd(true);
      //filter.grayscale(0.2);
      filter.negative();
      s.filters = [filter];
    }
    s.eventMode = 'static'; //dynamic';
    s.onpointerdown = e => this.pointerDown(e, gems);
    s.gemdex = i;
    container.addChild(s);
    return {k, s};
    //return this.makeGem(i, k, s, gems);
  }
  makeGem(i, k, s) {
    const gem = {
      k, 
      s,
      l: i % cols,
      t: Math.floor(i/cols),
      ol: 0, //(Math.random()-0.5) * 2,
      ot: 0, //(Math.random()-0.5) * 2,
      rotate: Math.random() < 0.05,
      pulse: Math.random() < 0.05,
    };
    //s.onpointerup = e => this.pointerUp(e, gems);
    //s.onpointerupoutside = e => this.pointerUp(e, gems);
    return gem;
  }
  ijToXy(i, j, oi, oj) {
    const xs = siz + margin;
    const ys = siz + margin;
    const x = xs * (i + oi) + (siz/2);
    const y = ys * (j + oj) + (siz/2);
    return [x, y];
  }
  scaleAndPositionGem(gem) {
    // reset scale to #0
    gem.s.scale = {x: scales[0], y: scales[0]};
    // get pixel location for this gem
    const [ix, jy] = this.ijToXy(gem.l, gem.t, gem.ol, gem.ot);
    gem.s.position = {x: ix, y: jy};
  }
};

customElements.define('pixi-sprite-grid', PixiSpriteGrid);

