/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Resources} from '../Media/Resources.js';
//import {loadImage} from '../Media/ImageLoader.js';
// import {THREE} from '../../third-party/threejs/threejs-import.js';
// import * as tools from '../Shader/shader-tools.js';

const log = logf('Services: Threejs', '#79AEA3');

const {assign} = Object;
const dom = (tag, props, container) => (container ?? document.body).appendChild(assign(document.createElement(tag), props));
const isImproperSize = (width, height) => (width !== 1280 && width !== 640) || (height !== 480 && height !== 720);

export const ThreejsService = class {
  static async allocateResource(app, atom, resource) {
    return Resources.allocate(resource);
  }
  static async allocateCanvas() {
    log('allocateCanvas');
    const canvas = dom('canvas', {style: 'display: none; width: 240px; height: 180px;'});
    return Resources.allocate(canvas);
  }
//   static async canvasFromImage(app, atom, request, {url}) {
//     log('canvasFromImage, url = ', url?.slice(0, 80));
//     const image = await loadImage(url);
//     const id = await this.allocateCanvas();
//     this.imageToCanvas(image, id);
//     return id;
//   }
//   static imageToCanvas(image, canvasId) {
//     const {width, height} = image;
//     if (width && height) {
//       const canvas = Resources.get(canvasId);
//       assign(canvas, {width, height});
//       //
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(image, 0, 0, width, height);
//     }
//   }
//   //
//   static async shaderize(app, atom, request, {shaderId, toy, inImageRef, outImageRef}) {
//     const [inCanvas, outCanvas] = [
//       Resources.get(inImageRef?.canvas),
//       Resources.get(outImageRef?.canvas)
//     ];
//     if (inCanvas && outCanvas && shaderId) {
//       const {width, height} = inCanvas;
//       if (isImproperSize(width, height)) {
//         log.warn('input canvas is improper', width, height);
//       } else {
//       // if (width && height) {
//         assign(outCanvas, {width, height});
//         const key = `${inImageRef?.canvas}:${outImageRef?.canvas}`;
//         const shader = await this.requireShader(shaderId, key, inCanvas, outCanvas, toy);
//         shader?.render(inCanvas, outCanvas);
//       }
//     }
//     return outImageRef;
//   }
//   static async requireShader(shaderId, canvasKeys, inCanvas, outCanvas, toy) {
//     // one shader per shader id
//     let shader = Resources.get(shaderId);
//     // but we must rebuild the shader if the canvasses change
//     // TODO(sjmiles): changing the canvas size(s) will break the shader
//     if (!shader || shader.canvasKeys !== canvasKeys || toy?.Shader?.info?.id !== shader.toyId) {
//       shader?.dispose();
//       log('allocating shader', shaderId, canvasKeys);
//       shader = Resources.set(shaderId, new ShaderJunk());
//       shader.canvasKeys = canvasKeys;
//       await shader.init(inCanvas, outCanvas, toy);
//     }
//     return shader;
//   }
//   //
//   static getImageSize(app, atom, request, {canvasId}) {
//     const canvas = Resources.get(canvasId);
//     if (canvas) {
//       return {
//         width: canvas.width,
//         height: canvas.height
//       };
//     }
//   }
};

// const ShaderJunk = class {
//   constructor() {
//     this.ready = false;
//     globalThis.junk = this;
//   }
//   dispose() {
//     this.ready = false;
//     this.renderer?.dispose();
//     this.renderer = null;
//     this.scene = null;
//     this.camera = null;
//   }
//   async init(inCanvas, outCanvas, toy) {
//     this.ready = false;
//     this.toyId = toy?.Shader?.info?.id;
//     const fragmentShader = await tools.loadShaderToy(toy);
//     try {
//       if (fragmentShader) {
//         this.initRenderer(inCanvas, outCanvas, fragmentShader);
//       } else {
//         log.warn('failed to load ShaderToy', toy);
//       }
//     } catch(x) {
//       log.error('renderer initialization failed');
//       log.groupCollapsed('details');
//       log(x);
//       log.groupEnd();
//     }
//   }
//   initRenderer(inCanvas, outCanvas, fragmentShader) {
//     const uniforms = tools.uniformsFactory();
//     this.uniforms = uniforms;
//     //
//     const texture = new THREE.CanvasTexture(inCanvas);
//     texture.minFilter = THREE.NearestFilter;
//     texture.magFilter = THREE.NearestFilter;
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     uniforms.iChannel0 = {value: texture};
//     this.texture = texture;
//     //
//     log('create material');
//     const material = new THREE.ShaderMaterial({
//       fragmentShader,
//       uniforms
//     });
//     //
//     // geometry to draw onto
//     const plane = new THREE.PlaneGeometry(2, 2);
//     const mesh = new THREE.Mesh(plane, material);
//     //
//     this.scene = new THREE.Scene();
//     this.scene.add(mesh);
//     //
//     const {width, height} = inCanvas;
//     //assign(outCanvas, {width, height});
//     //const [width, height] = [1280, 720];
//     this.size = {width, height};
//     this.uniforms.iResolution.value.set(width, height, 1);
//     //console.log(`iResolution.value.set(${width}, ${height}, 1)`);
//     //console.log(this.uniforms);
//     //
//     const renderer = new THREE.WebGLRenderer({canvas: outCanvas});
//     //renderer.autoClearColor = false;
//     this.renderer = renderer;
//     //
//     const camera = new THREE.OrthographicCamera(
//       -1, // left
//        1, // right
//        1, // top
//       -1, // bottom
//       -1, // near
//        1  // far
//     );
//     this.camera = camera;
//     //
//     this.ready = true;
//     log('initShader complete');
//   }
//   render(inCanvas, outCanvas) {
//     if (this.ready && inCanvas && outCanvas) {
//       this.privateRender(inCanvas, outCanvas);
//     }
//   }
//   privateRender(inCanvas, outCanvas) {
//     //const [width, height] = [1280, 720];
//     const {width, height} = inCanvas;
//     if (!width || !height) { //width !== 1280 || height !== 720) {
//       log.warn('input canvas is improper');
//     } else {
//       const now = Date.now();
//       this.start = this.start || now;
//       //
//       const delta = this.last ? now - this.last : 16;
//       this.uniforms.iTimeDelta.value = delta * 1e-3; // ms to s
//       //
//       this.last = now;
//       this.uniforms.iTime.value = (now-this.start) * 1e-3; // ms to s
//       //
//       this.texture.needsUpdate = true;
//       try {
//         this.renderer.render(this.scene, this.camera);
//       } catch(x) {
//         this.ready = false;
//         log.error('WebGL renderer failed');
//         console.groupCollapsed('error');
//         console.error(x);
//         console.groupEnd();
//       }
//     }
//   }
// };
