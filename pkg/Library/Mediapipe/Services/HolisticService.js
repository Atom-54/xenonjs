/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Resources} from '../../Media/Resources.js';
import {MediapipeClassifier} from './MediapipeClassifier.js';

const relPath = '../../../third-party/mediapipe';

// late-bind the dependencies so we pay-for-usage

let Classifier;
const requireClassifier = async () => {
  if (!Classifier) {
    await MediapipeClassifier.import(`${relPath}/utils/drawing_utils.js`);
    await MediapipeClassifier.import(`${relPath}/holistic/holistic.js`);
    Classifier = globalThis.Holistic;
  }
};

const local = import.meta.url.split('/').slice(0, -1).join('/');
const locateFile = file => `${local}/${relPath}/holistic/${file}`;

export const HolisticService = {
  async classify(layer, atom, {image, target}) {
    // get our input canvas objects
    const [realImage, realTarget]= [Resources.get(image?.canvas), Resources.get(target)];
    // confirm stability
    if (realTarget && realImage) {
      const {width, height} = realImage;
      if (width && height) {
        // classify!
        const raw = await MediapipeModel.classifier(realImage, realTarget);
        const {leftHandLandmarks, rightHandLandmarks, faceLandmarks, poseLandmarks, multiFaceGeometry, width: w, height: h} = raw.results;
        const results = {leftHandLandmarks, rightHandLandmarks, faceLandmarks, poseLandmarks, multiFaceGeometry, width: w, height: h, image};
        // compute output canvas
        const bitmap = raw?.results?.segmentationMask;
        render(bitmap, realTarget, width, height);
        // return our target canvas
        return {results, mask: {canvas: target, stream: image?.stream, version: Math.random()}};
      }
    }
  },
  async marks(layer, atom, {canvas, markers, connectors, options}) {
    const {drawConnectors: lines, drawLandmarks: marks} = window;
    const realCanvas = Resources.get(canvas);
    if (markers && realCanvas) {
      const ctx = realCanvas.getContext('2d');
      ctx.globalCompositeOperation = options?.op ?? 'source-over';
      if (connectors) {
        return lines?.(ctx, markers, connectors, options);
      }
      return marks?.(ctx, markers, options);
    }
  }
};

const render = (bitmap, target, width, height) => {
  if (bitmap) {
    target.width = width;
    target.height = height;
    const ctx = target.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    // colorizing
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = '#680fa3'; //'#00FF00';
    ctx.fillRect(0, 0, width, height);
  }
};

export const MediapipeModel = {
  ...MediapipeClassifier,
  async classifier(image) {
    return this.classify(await this.getClassifier(), image);
  },
  async getClassifier() {
    await requireClassifier();
    const classifier = new Classifier({locateFile});
    classifier.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      enableSegmentation: true
    });
    this.getClassifier = () => classifier;
    return classifier;
  },
};
