/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
//import {Resources} from '../App/Resources.js';

// late-bind the dependencies to reduce so we pay-for-usage

let CocoSsdModel;

const requireCocoSsdModel = async () => {
  if (!CocoSsdModel) {
    await import('./TensorFlow.js');
    await import('../../../third-party/tensorflow-models/coco-ssd.min.js');
    if (globalThis.cocoSsd) {
      CocoSsdModel = await new Promise(resolve => globalThis.cocoSsd.load().then(resolve));
    }
  }
  return CocoSsdModel;
};

export const CocoSsdService = {
  async classify(host, {image}) {
    // get our input canvas objects
    const realImage = Resources.get(image?.canvas);
    // confirm dependencies
    if (realImage) {
      const {width, height} = realImage;
      if (width && height) {
        // late-binding so we only load on demand
        const cocoSsdModel = await requireCocoSsdModel();
        // classify!
        return new Promise(resolve => cocoSsdModel?.detect(realImage).then(resolve));
      }
    }
  },
  async drawBoxes(host, {canvas, data}) {
    const realTarget = Resources.get(canvas);
    if (realTarget && data?.filter) {
      const ctx = realTarget.getContext('2d');
      const {width, height} = realTarget;
      if (width && height) {
        //ctx.clearRect(0, 0, width, height);
        const boxes = data.filter(r=>r?.bbox);
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'darkorange';
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        boxes.forEach(({bbox: [l, t, w, h], ...info}) => {
          ctx.fillRect(l, t, w, h);
          ctx.strokeRect(l, t, w, h);
        });
        ctx.font = "16px sans-serif";
        ctx.lineWidth = 0.8;
        ctx.fillStyle = 'white';
        boxes.forEach(({bbox: [l, t, w, h], ...info}) => {
          const txt = `${info.class} (${info.score.toFixed(2)})`;
          ctx.fillText(txt, l+8, t+20);
        });
      }
    }
  }
};
