/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const FRAME_SIZE = {width: 1280, height: 720};

const VIDEO = document.createElement('video');
VIDEO.id = 'basic-camera-video';

// Input canvas
//const INPUT_CAMERA_CANVAS = new OffscreenCanvas(FRAME_SIZE.width, FRAME_SIZE.height);
const INPUT_CAMERA_CANVAS = document.createElement('canvas');
Object.assign(INPUT_CAMERA_CANVAS, {...FRAME_SIZE, id: 'basic-camera-input-canvas'});
const INPUT_CAMERA_CTX = INPUT_CAMERA_CANVAS.getContext('2d');

// Output canvas
const OUTPUT_CANVAS = document.createElement('canvas');
Object.assign(OUTPUT_CANVAS, {...FRAME_SIZE, id: 'basic-camera-output-canvas'});

/**
 * Copies incoming image from real camera to the input camera canvas
 */
let capturing;
async function captureLoop() {
  if (!capturing) {
    capturing = true;
    await capture();
    capturing = false;
  }
}

/**
 * Enumerates through required models and run predictions
 */
async function capture() {
  INPUT_CAMERA_CTX.drawImage(VIDEO, 0, 0);
}

let loopInterval;
async function start() {
  const cameraStream = await navigator.mediaDevices.getUserMedia({
    video: {
      ...FRAME_SIZE
    }
  });
  VIDEO.srcObject = cameraStream;
  await VIDEO.play();
  //
  window.clearInterval(loopInterval);
  loopInterval = window.setInterval(captureLoop, 16);
  //
  return INPUT_CAMERA_CANVAS;
}

export const getBasicCameraStream = async () => {
  const canvas = await start();
  console.log(canvas);
  const stream = canvas.captureStream(30);
  console.log(stream);
  return stream;
};