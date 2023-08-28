/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {uniformsFactory, fragmentShader} from './shader-tools.js';
import {THREE} from '../Threejs/threejs-import.js';
import {Resources} from '../Media/Resources.js';

const {assign} = Object;

const log = logf('Service: Shader', 'teal');

//const isImproperSize = (width, height) => !width || !height;

export const ShaderService = {
  makeShader(app, atom, {shader, shaderId}) {
    Resources.free(shaderId);
    const fragShader = new ShaderJunk();
    fragShader.init(shader);
    return Resources.allocate(fragShader);
  },
  async runFragment(app, atom, {shaderId, inImageRefs, inAudioRef, outImageRef}) {
    // get real shader
    const shader = Resources.get(shaderId);
    // get real output canvas
    const outCanvas = Resources.get(outImageRef?.canvas);
    // get all the real input canvases
    const inCanvases = inImageRefs.map(ref => ref && Resources.get(ref.canvas));
    // get the real audio input
    const inAudio = Resources.get(inAudioRef);
    // if (shader) {
    //   shader?.render(inCanvases, outCanvas);
    // }
    // if (inCanvases?.[0] && outCanvas && shader) {
    if ((inCanvases?.[0] || inAudio) && outCanvas && shader) {
      const {width, height} = inCanvases?.[0] || {width: 640, height: 480};
      //   if (isImproperSize(width, height)) {
      //     log.warn('input canvas is improper', width, height);
      //   } else {
      assign(outCanvas, {width, height});
      shader?.render(inCanvases, inAudio, outCanvas);
      //   }
    }
    return outImageRef;
  }
};

const ShaderJunk = class {
  constructor() {
    this.ready = false;
    globalThis.junk = this;
  }
  dispose() {
    this.ready = false;
    this.renderer?.dispose();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
  }
  async init(fragment) {
    try {
      this.createStuff(fragmentShader(fragment));
    } catch(x) {
      log.error('renderer initialization failed');
      log.groupCollapsed('details');
      log(x);
      log.groupEnd();
    }
  }
  createStuff(fragmentShader) {
    // webGL resolution
    const [width, height] = [1280, 720];
    // shader parameters
    const uniforms = uniformsFactory();
    this.uniforms = uniforms;
    this.uniforms.iResolution.value.set(width, height, 1);
    // inputs texture for shader
    const channels = [
      this.createChannel(width, height),
      this.createChannel(width, height),
      this.createChannel(width, height),
      this.createChannel(width, height)
    ];
    this.channels = channels;
    // attach textures to channels
    uniforms.iChannel0 = {value: channels[0].texture};
    uniforms.iChannel1 = {value: channels[1].texture};
    uniforms.iChannel2 = {value: channels[2].texture};
    uniforms.iChannel3 = {value: channels[3].texture};
    //this.audioChannel = this.createAudioChannel();
    //uniforms.iAudioChannel = {value: this.audioChannel.texture};
    // our shader material
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms
    });
    // geometry to draw onto
    const plane = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(plane, material);
    // create scene
    this.scene = new THREE.Scene();
    this.scene.add(mesh);
    // create camera
    const camera = new THREE.OrthographicCamera(
      -1, // left
       1, // right
       1, // top
      -1, // bottom
      -1, // near
       1  // far
    );
    this.camera = camera;
    // target canvas for GL projection
    this.shadedCanvas = new OffscreenCanvas(width, height);
    // construct renderer
    const renderer = new THREE.WebGLRenderer({canvas: this.shadedCanvas});
    //renderer.autoClearColor = false;
    this.renderer = renderer;
  }
  createChannel(width, height) {
    const textureCanvas = new OffscreenCanvas(width, height);
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return {texture, textureCanvas};
  }
  render(inCanvases, inAudio, outCanvas) {
    // advance time
    this.timeCadence();
    // inCanvases will be stretched to fix textureCanvas dimensions
    inCanvases.forEach((canvas, i) => {
      const channel = this.channels[i];
      if (canvas && channel) {
        this.updateChannel(channel, canvas);
      }
    });
    // prepare audio channel data
    this.updateAudioChannel(inAudio);
    // shadedCanvas will be stretched to fix outCanvas dimensions
    this.privateRender(outCanvas);
  }
  updateChannel(inChannel, inCanvas) {
    // inCanvas will be stretched to fix textureCanvas dimensions
    const {width, height} = inChannel.textureCanvas;
    const ctx = inChannel.textureCanvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(inCanvas, 0, 0, width, height);
    inChannel.texture.needsUpdate = true;
  }
  updateAudioChannel(inAudio) {
    if (inAudio) {
      if (!this.buffer) {
        log('creating audio buffer of length', inAudio.bufferLength);
        this.buffer = new Uint8Array(inAudio.bufferLength);
      }
      inAudio.analyser.getByteTimeDomainData(this.buffer);
      const {texture} = this.createAudioChannel(this.buffer);
      this.uniforms.iAudioChannel = {value: texture};
    }
  }
  createAudioChannel(data) {
    const texture = new THREE.DataArrayTexture(data, 1024, 1, 1028);
    //log(data);
    // const texture = new THREE.DataArrayTexture(data);
    // texture.minFilter = THREE.MinFilter;
    // texture.magFilter = THREE.Nearest;
    // //texture.wrapS = THREE.ClampToEdge;
    // //texture.wrapT = THREE.ClampToEdge;
    return {texture};
  }
  privateRender(outCanvas) {
    // attempt to render the scene
    try {
      // project the image in through the shader,
      // onto the surface, and out through the camera
      this.renderer.render(this.scene, this.camera);
      // shadedCanvas will be stretched to fix outCanvas dimensions
      outCanvas.getContext('2d')
        .drawImage(this.shadedCanvas, 0, 0, outCanvas.width, outCanvas.height);
    } catch(x) {
      // uhps
      this.ready = false;
      log.error('WebGL renderer failed');
      log.groupCollapsed('error');
      log.error(x);
      log.log(this);
      log.groupEnd();
    }
  }
  timeCadence() {
    // now is now
    const now = performance.now();
    this.start = this.start || now;
    // time since last time, otherwise 16ms
    const delta = this.last ? now - this.last : 16;
    // memoize
    this.last = now;
    // record uniforms for shader
    this.uniforms.iTimeDelta.value = delta * 1e-3; // ms to s
    this.uniforms.iTime.value = (now-this.start) * 1e-3; // ms to s
  }
};

const defaultShader = `
/*
 * Webcam 'Giant in a lake' effect by Ben Wheatley - 2018
 * License MIT License
 * Contact: github.com/BenWheatley
 */

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = iTime;
    vec2 uv = fragCoord.xy / iResolution.xy;

    vec2 pixelSize = vec2(1,1) / iResolution.xy;

    vec3 col = texture(iChannel0, uv).rgb;
    float mirrorPos = 0.3;
    if (uv.y < mirrorPos) {
        float distanceFromMirror = mirrorPos - uv.y;
        float sine = sin((log(distanceFromMirror)*20.0) + (iTime*2.0));
        float dy = 30.0*sine;
        float dx = 0.0;
        dy *= distanceFromMirror;
        vec2 pixelOff = pixelSize * vec2(dx, dy);
        vec2 tex_uv = uv + pixelOff;
        tex_uv.y = (0.6 /* magic number! */) - tex_uv.y;
        col = texture(iChannel0, tex_uv).rgb;

        float shine = (sine + dx*0.05) * 0.05;
        col += vec3(shine, shine, shine);
    }

    fragColor = vec4(col,1.);
}
`;