/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../Resources.js';

// import {Xen} from '../Dom/Xen/xen-async.js';
// import {Resources} from '../App/Resources.js';
// import {Paths, deepEqual} from '../Core/utils.js';
import {PIXI} from './pixi.js';

const assets = Paths.resolve('$root/third_party/pixijs/assets');

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
    // this.canvas = this._dom.$('canvas');
  }
  update({demo, image}, state) {
    let demoName = demo;
    const demos = {
      Spiral,
      Shader,
      BlendMode,
      Transparent,
      Tinting,
      CacheAsBitmap,
      ImageTexture,
      SpineBoy
    };
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
    if (state.app && demoName !== state.demo) {
      state.app.destroy(true);
      state.app = null;
    }
    //
    if (!state.app && demoName) {
      state.demo = demoName;
      const demoFunc = demos[demoName];
      if (demoFunc) {
        const app = state.app = new PIXI.Application({
          width: 1280, height: 720,
          //width: 800, height: 600,
          // view: this.canvas,
          forceCanvas: true,
          backgroundAlpha: (demoFunc === Transparent) ? 0 : 1
        });
        this.host.appendChild(app.view);
        demoFunc(app, state);
        state.appCanvasId = Resources.allocate(state.app.view);
        console.log('appCanvasId achieved:', state.appCanvasId);
        setInterval(app.ticker._tick, 16);
      }
    }
    //
    if (state.appCanvasId) {
      setTimeout(() => this.invalidate(), 16);
      this.value = {canvas: state.appCanvasId, version: Math.random()};
      this.fire('image');
    }
  }
}

customElements.define('pixi-view', PixiView);

//const clamp = (v, mn, mx) => Math.min(mx, Math.max(mn, v));

const ImageTexture = (app, {canvas}) => {
  //const {width, height} = app.screen;
  const texture = PIXI.RenderTexture.from(canvas);
  const sprite = new PIXI.Sprite(texture);
  app.stage.addChild(sprite);
  //app.renderer.render(app.stage, {renderTexture: texture});
};

const Spiral = app => {
  const {width, height} = app.screen;
  const [w2, h2] = [width/2, height/2];
  // create two render textures... these dynamic textures will be used to draw the scene into itself
  let renderTexture = PIXI.RenderTexture.create({width, height});
  let renderTexture2 = PIXI.RenderTexture.create({width, height});
  const currentTexture = renderTexture;
  // create a new sprite that uses the render texture we created above
  const outputSprite = new PIXI.Sprite(currentTexture);
  // align the sprite
  outputSprite.x = w2;
  outputSprite.y = h2;
  outputSprite.anchor.set(0.5);
  // add to stage
  app.stage.addChild(outputSprite);
  const stuffContainer = new PIXI.Container();
  stuffContainer.x = 400;
  stuffContainer.y = 300;
  app.stage.addChild(stuffContainer);
  // create an array of image ids..
  const fruits = [];
  for (let i=0; i<8; i++) fruits[i] = `${assets}/rt_object_0${i+1}.png`;
  // create an array of items
  const items = [];
  // now create some items and randomly position them in the stuff container
  for (let i = 0; i < 20; i++) {
    const item = PIXI.Sprite.from(fruits[i % fruits.length]);
    item.x = (Math.random() - 0.5) * w2;
    item.y = (Math.random() - 0.5) * h2;
    item.anchor.set(0.5);
    stuffContainer.addChild(item);
    items.push(item);
  }
  // used for spinning!
  let count = 0;
  const tick = () => {
    for (let i = 0; i < items.length; i++) {
      // rotate each item
      const item = items[i];
      item.rotation += 0.1;
    }
    count += 0.01;
    // swap the buffers ...
    const temp = renderTexture;
    renderTexture = renderTexture2;
    renderTexture2 = temp;
    // set the new texture
    outputSprite.texture = renderTexture;
    // twist this up!
    stuffContainer.rotation -= 0.01;
    outputSprite.scale.set(1 + Math.sin(count) * 0.2);
    // render the stage to the texture
    // the 'true' clears the texture before the content is rendered
    app.renderer.render(app.stage, {
      renderTexture: renderTexture2,
      clear: false
    });
  };
  app.ticker.stop();
  app.ticker.add(tick);
  app.ticker.start();
};

const Shader = app => {
  // Build geometry.
  const geometry = new PIXI.Geometry()
    .addAttribute('aVertexPosition', // the attribute name
      [-100, -100, // x, y
        100, -100, // x, y
        100, 100,
        -100, 100], // x, y
      2) // the size of the attribute
    .addAttribute('aUvs', // the attribute name
      [0, 0, // u, v
        1, 0, // u, v
        1, 1,
        0, 1], // u, v
      2) // the size of the attribute
    .addIndex([0, 1, 2, 0, 2, 3]);
  const vertexSrc = `
    precision mediump float;
    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;
    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;
    varying vec2 vUvs;
    void main() {
        vUvs = aUvs;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }`;
  const fragmentSrc = `
  //Based on this: https://www.shadertoy.com/view/wtlSWX
  precision mediump float;
  varying vec2 vUvs;
  uniform sampler2D noise;
  uniform float time;

  //Distance function. Just calculates the height (z) from x,y plane with really simple length check. Its not exact as there could be shorter distances.
  vec2 dist(vec3 p)
  {
      float id = floor(p.x)+floor(p.y);
      id = mod(id, 2.);
      float h = texture2D(noise, vec2(p.x, p.y)*0.04).r*5.1;
      return vec2(h-p.z,id);
  }
  //Light calculation.
  vec3 calclight(vec3 p, vec3 rd)
  {
      vec2 eps = vec2( 0., 0.001);
      vec3 n = normalize( vec3(
      dist(p+eps.yxx).x - dist(p-eps.yxx).x,
      dist(p+eps.xyx).x - dist(p-eps.xyx).x,
      dist(p+eps.xxy).x - dist(p-eps.xxy).x
      ));
      vec3 d = vec3( max( 0., dot( -rd ,n)));
      return d;
  }
  void main()
  {
      vec2 uv = vec2(vUvs.x,1.-vUvs.y);
      uv *=2.;
      uv-=1.;
      vec3 cam = vec3(0.,time -2., -3.);
      vec3 target = vec3(sin(time)*0.1, time+cos(time)+2., 0. );
      float fov = 2.2;
      vec3 forward = normalize( target - cam);
      vec3 up = normalize(cross( forward, vec3(0., 1.,0.)));
      vec3 right = normalize( cross( up, forward));
      vec3 raydir = normalize(vec3( uv.x *up + uv.y * right + fov*forward));
      //Do the raymarch
      vec3 col = vec3(0.);
      float t = 0.;
      for( int i = 0; i < 100; i++)
      {
      vec3 p = t * raydir + cam;
      vec2 d = dist(p);
      t+=d.x*0.5;//Jump only half of the distance as height function used is not really the best for heightmaps.
      if(d.x < 0.001)
      {
          vec3 bc = d.y < 0.5 ? vec3(1.0,0.8,0.0) :  vec3(0.8,0.0,1.0);
          col = vec3( 1.) * calclight(p, raydir) * (1. - t/150.) *bc;
          break;
      }
      if(t > 1000.)
      {
          break;
      }
      }
      gl_FragColor = vec4(col, 1.);
  }`;
  const uniforms = {
    noise: PIXI.Texture.from(`${assets}/perlin.jpg`),
    time: 0,
  };
  // Make sure repeat wrap is used and no mipmapping.
  uniforms.noise.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
  uniforms.noise.baseTexture.mipmap = false;
  // Build the shader and the quad.
  const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);
  const quad = new PIXI.Mesh(geometry, shader);
  quad.position.set(400, 300);
  quad.scale.set(2);
  app.stage.addChild(quad);
  // start the animation..
  let time = 0;
  app.ticker.add((delta) => {
    time += 1 / 60;
    quad.shader.uniforms.time = time;
    quad.scale.set(Math.cos(time) * 1 + 2, Math.sin(time * 0.7) * 1 + 2);
  });
};

const BlendMode = app => {
  // create a new background sprite
  const background = PIXI.Sprite.from(`${assets}/bg_rotate.jpg`);
  background.width = app.screen.width;
  background.height = app.screen.height;
  app.stage.addChild(background);
  // create an array to store a reference to the dudes
  const dudeArray = [];
  const totaldudes = 20;
  for (let i = 0; i < totaldudes; i++) {
    // create a new Sprite that uses the image name that we just generated as its source
    const dude = PIXI.Sprite.from(`${assets}/flowerTop.png`);
    dude.anchor.set(0.5);
    // set a random scale for the dude
    dude.scale.set(0.8 + Math.random() * 0.3);
    // finally let's set the dude to be at a random position...
    dude.x = Math.floor(Math.random() * app.screen.width);
    dude.y = Math.floor(Math.random() * app.screen.height);
    // The important bit of this example, this is how you change the default blend mode of the sprite
    dude.blendMode = PIXI.BLEND_MODES.ADD;
    // create some extra properties that will control movement
    dude.direction = Math.random() * Math.PI * 2;
    // this number will be used to modify the direction of the dude over time
    dude.turningSpeed = Math.random() - 0.8;
    // create a random speed for the dude between 0 - 2
    dude.speed = 2 + Math.random() * 2;
    // finally we push the dude into the dudeArray so it it can be easily accessed later
    dudeArray.push(dude);
    app.stage.addChild(dude);
  }
  // create a bounding box for the little dudes
  const dudeBoundsPadding = 100;
  const dudeBounds = new PIXI.Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app.screen.width + dudeBoundsPadding * 2,
    app.screen.height + dudeBoundsPadding * 2,
  );
  app.ticker.add(() => {
    // iterate through the dudes and update the positions
    for (let i = 0; i < dudeArray.length; i++) {
      const dude = dudeArray[i];
      dude.direction += dude.turningSpeed * 0.01;
      dude.x += Math.sin(dude.direction) * dude.speed;
      dude.y += Math.cos(dude.direction) * dude.speed;
      dude.rotation = -dude.direction - Math.PI / 2;
      // wrap the dudes by testing their bounds...
      if (dude.x < dudeBounds.x) {
          dude.x += dudeBounds.width;
      } else if (dude.x > dudeBounds.x + dudeBounds.width) {
          dude.x -= dudeBounds.width;
      }
      if (dude.y < dudeBounds.y) {
          dude.y += dudeBounds.height;
      } else if (dude.y > dudeBounds.y + dudeBounds.height) {
          dude.y -= dudeBounds.height;
      }
    }
  });
};

const SpineBoy = async app => {
  app.stage.interactive = true;
  // load spine data
  PIXI.Assets.add('spineboypro', `${assets}/pixi-spine/spineboy-pro.json`);
  const json = await PIXI.Assets.load('spineboypro');
  // create a spine boy
  const atlas = {}; // ?
  const p = (new PIXI.spine.SpineParser()).createJsonParser();
  const spine = p.readSkeletonData(atlas, json);
  console.log(spine);
  const spineBoyPro = new PIXI.spine.Spine(json);
  //
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
  app.stage.on('pointerdown', () => {
    let animation = '';
    do {
        animation = allAnimations[Math.floor(Math.random() * allAnimations.length)];
    } while (animation === lastAnimation);
    spineBoyPro.state.setAnimation(0, animation, loopAnimations.includes(animation));
    lastAnimation = animation;
  });
};

const Transparent = app => {
  // create a new Sprite from an image path.
  const bunny = PIXI.Sprite.from(`${assets}/bunny.png`);
  // make the bunny way bigger
  bunny.scale.set(4, 4);
  // center the sprite's anchor point
  bunny.anchor.set(0.5);
  // move the sprite to the center of the screen
  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;
  app.stage.addChild(bunny);
  app.ticker.add(() => {
      // just for fun, let's rotate mr rabbit a little
      bunny.rotation += 0.1;
  });
};

const Tinting = app => {
  // holder to store the aliens
  const aliens = [];
  const totalDudes = 20;
  for (let i=0; i<totalDudes; i++) {
    // create a new Sprite that uses the image name that we just generated as its source
    const dude = PIXI.Sprite.from(`${assets}/eggHead.png`);
    // set the anchor point so the texture is centered on the sprite
    dude.anchor.set(0.5);
    // set a random scale for the dude - no point them all being the same size!
    dude.scale.set(0.8 + Math.random() * 0.3);
    // finally lets set the dude to be at a random position..
    dude.x = Math.random() * app.screen.width;
    dude.y = Math.random() * app.screen.height;
    dude.tint = Math.random() * 0xFFFFFF;
    // create some extra properties that will control movement :
    // create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees
    dude.direction = Math.random() * Math.PI * 2;
    // this number will be used to modify the direction of the dude over time
    dude.turningSpeed = Math.random() - 0.8;
    // create a random speed for the dude between 2 - 4
    dude.speed = 2 + Math.random() * 2;
    // finally we push the dude into the aliens array so it it can be easily accessed later
    aliens.push(dude);
    app.stage.addChild(dude);
  }
  // create a bounding box for the little dudes
  const dudeBoundsPadding = 100;
  const dudeBounds = new PIXI.Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app.screen.width + dudeBoundsPadding * 2,
    app.screen.height + dudeBoundsPadding * 2
  );
  app.ticker.add(() => {
    // iterate through the dudes and update their position
    for (let i = 0; i < aliens.length; i++) {
      const dude = aliens[i];
      dude.direction += dude.turningSpeed * 0.01;
      dude.x += Math.sin(dude.direction) * dude.speed;
      dude.y += Math.cos(dude.direction) * dude.speed;
      dude.rotation = -dude.direction - Math.PI / 2;
      // wrap the dudes by testing their bounds...
      if (dude.x < dudeBounds.x) {
        dude.x += dudeBounds.width;
      } else if (dude.x > dudeBounds.x + dudeBounds.width) {
        dude.x -= dudeBounds.width;
      }
      if (dude.y < dudeBounds.y) {
        dude.y += dudeBounds.height;
      } else if (dude.y > dudeBounds.y + dudeBounds.height) {
        dude.y -= dudeBounds.height;
      }
    }
  });
};

const CacheAsBitmap = async app => {
  app.stop();
  const alienFrames = [
    'eggHead.png',
    'flowerTop.png',
    'helmlok.png',
    'skully.png',
  ];
  // holder to store aliens
  const aliens = [];
  let count = 0;
  // create an empty container
  const alienContainer = new PIXI.Container();
  alienContainer.x = 400;
  alienContainer.y = 300;
  // load resources
  //await PIXI.Assets.add('spritesheet', `${assets}/spritesheet/monsters.json`);
  // add a bunch of aliens with textures from image paths
  for (let i = 0; i < 100; i++) {
    const frameName = alienFrames[i % 4];
    // create an alien using the frame name
    const alien = PIXI.Sprite.from(`${assets}/${frameName}`);
    /*
     * fun fact for the day :)
     * another way of doing the above would be
     * var texture = PIXI.Texture.from(frameName);
     * var alien = new PIXI.Sprite(texture);
     */
    alien.tint = Math.random() * 0xFFFFFF;
    alien.x = Math.random() * 800 - 400;
    alien.y = Math.random() * 600 - 300;
    alien.anchor.x = 0.5;
    alien.anchor.y = 0.5;
    aliens.push(alien);
    alienContainer.addChild(alien);
  }
  // make the stage interactive
  app.stage.interactive = true;
  app.stage.addChild(alienContainer);
  // Combines both mouse click + touch tap
  app.stage.on('pointertap', onClick);
  function onClick() {
    alienContainer.cacheAsBitmap = !alienContainer.cacheAsBitmap;
    // feel free to play with what's below
    // var sprite = new PIXI.Sprite(alienContainer.generateTexture());
    // app.stage.addChild(sprite);
    // sprite.x = Math.random() * 800;
    // sprite.y = Math.random() * 600;
  }
  app.ticker.add(() => {
    // let's rotate the aliens a little bit
    for (let i=0; i<100; i++) {
      const alien = aliens[i];
      alien.rotation += 0.1;
    }
    count += 0.01;
    alienContainer.scale.x = Math.sin(count);
    alienContainer.scale.y = Math.sin(count);
    alienContainer.rotation += 0.01;
  });
  app.start();
};

const Asteroids = async app => {
  const frames = [
    'eggHead.png',
    'flowerTop.png',
    'helmlok.png',
    'skully.png',
  ];
  // holder to store aliens
  const rocks = [];
  let count = 0;
  // create an empty container
  const container = new PIXI.Container();
  container.x = 0;
  container.y = 0;
  // load resources
  //await PIXI.Assets.add('spritesheet', `${assets}/spritesheet/monsters.json`);
  // add a bunch of aliens with textures from image paths
  for (let i = 0; i < 10; i++) {
    const rock = PIXI.Sprite.from(`${assets}/${eggHead.png}`);
    // alien.tint = Math.random() * 0xFFFFFF;
    alien.x = Math.random() * 800 - 400;
    alien.y = Math.random() * 600 - 300;
    alien.dx = Math.floor(Math.random()*3) - 1;
    // alien.anchor.x = 0.5;
    // alien.anchor.y = 0.5;
    frames.push(rock);
    container.addChild(rock);
  }
  // make the stage interactive
  app.stage.interactive = true;
  app.stage.addChild(alienContainer);
  // Combines both mouse click + touch tap
  app.stage.on('pointertap', onClick);
  function onClick() {
    alienContainer.cacheAsBitmap = !alienContainer.cacheAsBitmap;
    // feel free to play with what's below
    // var sprite = new PIXI.Sprite(alienContainer.generateTexture());
    // app.stage.addChild(sprite);
    // sprite.x = Math.random() * 800;
    // sprite.y = Math.random() * 600;
  }
  app.ticker.add(() => {
    // let's rotate the aliens a little bit
    for (let i=0; i<100; i++) {
      const alien = aliens[i];
      alien.rotation += 0.1;
    }
    count += 0.01;
    alienContainer.scale.x = Math.sin(count);
    alienContainer.scale.y = Math.sin(count);
    alienContainer.rotation += 0.01;
  });
  app.start();
};