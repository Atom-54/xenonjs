/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Resources} from '../../Media/Resources.js';
import {MediapipeClassifier} from './MediapipeClassifier.js';
import '../../../third-party/mediapipe/utils/drawing_utils.js';

const {drawLandmarks, drawConnectors, lerp} = globalThis;
const mpHolistic = globalThis;

// late-bind dependencies so we pay-for-usage

const local = import.meta.url.split('/').slice(0, -1).join('/');
const locateFile = file => `${local}/../../../third-party/mediapipe/face_mesh/${file}`;

let FaceMesh;
const requireFaceMesh = async () => {
  if (!FaceMesh) {
    await MediapipeClassifier.import('../../../third-party/mediapipe/face_mesh/face_mesh.js');
    FaceMesh = globalThis.FaceMesh;
  }
};

const masque = null; //await loadImage(`assets/masquerade.png`);
const scalar = 25;

export const FaceMeshService = {
  async classify(app, atom, {image, target}) {
    const realCanvas = Resources.get(image?.canvas);
    let results = {};
    if (realCanvas) {
      results = await FaceMeshModel.faceMesh(realCanvas);
      results.image = {canvas: results?.canvas, stream: image?.stream, version: Math.random()};
    }
    return results;
  },
  async faceMesh(app, atom, {image}) {
    await requireFaceMesh();
    const realCanvas = Resources.get(image?.canvas);
    let results = {};
    if (realCanvas) {
      results = await Mediapipe.faceMesh(realCanvas);
      results.image = {canvas: results?.canvas, stream: image?.stream, version: Math.random()};
    }
    return results;
  },
  //
  async clear(app, atom, {target}) {
    const realTarget = Resources.get(target);
    if (realTarget) {
      const ctx = realTarget.getContext('2d');
      ctx.clearRect(0, 0, realTarget.width, realTarget.height);
    }
  },
  async renderSticker(app, atom, {data, sticker, target, index}) {
    const faceLandmarks = data?.faceLandmarks ?? data?.multiFaceLandmarks?.[0];
    const realTarget = Resources.get(target);
    const realSticker = sticker ? Resources.get(sticker) : masque;
    const {width, height} = data ?? 0;
    if (faceLandmarks && realTarget && width && height) {
      Object.assign(realTarget, {width, height});
      const ctx = realTarget.getContext('2d');
      FaceMeshModel.renderSticker(ctx, {faceLandmarks}, realSticker, index);
    }
  },
  async renderFace(app, atom, {data, target}) {
    const faceLandmarks = data?.faceLandmarks ?? data?.multiFaceLandmarks?.[0];
    const realTarget = Resources.get(target);
    const {width, height} = data ?? 0;
    if (faceLandmarks && realTarget && width && height) {
      Object.assign(realTarget, {width, height});
      const ctx = realTarget.getContext('2d');
      FaceMeshModel.renderFace(ctx, {faceLandmarks});
    }
  }
};

export const FaceMeshModel = {
  ...MediapipeClassifier,
  async faceMesh(image) {
    return this.classify(await this.getFaceMesh(), image);
  },
  async getFaceMesh() {
    await requireFaceMesh();
    const facemesh = new FaceMesh({locateFile});
    facemesh.setOptions({
      modelComplexity: 1, // 0, 1, 2
      smoothLandmarks: true, // reduce jitter in landmarks
      //enableSegmentation: true, // also produce segment mask
      //smoothSegmentation: true, // reduce jitter in segment mask
      //refineFaceLandmarks: true, // more detail in mouth and iris
      minDetectionConfidence: 0.5, // human detection thresholds
      minTrackingConfidence: 0.5
    });
    this.getFaceMesh = () => facemesh;
    return facemesh;
  },
  renderFace(ctx, {faceLandmarks}) {
    const h = mpHolistic;
    const dc = (...args) => drawConnectors(ctx, faceLandmarks, ...args);
    dc(h.FACEMESH_TESSELATION, {color: '#C0C0C070', lineWidth: 1});
    dc(h.FACEMESH_RIGHT_EYE, {color: 'rgb(0,217,231)'});
    dc(h.FACEMESH_RIGHT_EYEBROW, {color: 'rgb(0,217,231)'});
    dc(h.FACEMESH_LEFT_EYE, {color: 'rgb(255,138,0)'});
    dc(h.FACEMESH_LEFT_EYEBROW, {color: 'rgb(255,138,0)'});
    dc(h.FACEMESH_FACE_OVAL, {color: '#E0E0E0', lineWidth: 5});
    dc(h.FACEMESH_LIPS, {color: '#E0E0E0', lineWidth: 5});
  },
  renderSticker(ctx, {faceLandmarks}, sticker, index) {
    if (faceLandmarks) {
      // find a centroid between the eybrows
      const {FACEMESH_LEFT_EYEBROW: LEB} = mpHolistic;
      const p0 = faceLandmarks?.[LEB[LEB.length-1]?.[0] || 0];
      const {FACEMESH_RIGHT_EYEBROW: REB} = mpHolistic;
      const p1 = faceLandmarks?.[REB[REB.length-1]?.[0] || 0];
      const [x, y, z] = [(p0.x+p1.x)/2, (p0.y+p1.y)/2, (p0.z+p1.z)/2];
      //const {x, y, z} = faceLandmarks[index] || {x:0,y:0,z:0};
      // map sticker to centroid
      const [sx, sy] = [x*ctx.canvas.width, y*ctx.canvas.height];
      // resize sticker
      const depth = lerp(z, -0.15, .1, 10, 1);
      const size = depth / scalar;
      const [sw, sh] = [sticker.width*size, sticker.height*size];
      // offset to top-left sticker corner
      const [cx, cy] = [sw/2, sh/2];
      ctx.drawImage(sticker, sx-cx, sy-cy, sw, sh);
    }
  }
};
