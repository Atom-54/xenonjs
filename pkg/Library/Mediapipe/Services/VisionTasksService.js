/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Resources} from '../../Media/Resources.js';

// late-bind these dependencies for pay-go

let VisionTasks;
const requireVisionTasks = async () => {
  if (!VisionTasks) {
    VisionTasks = await import('../../../third-party/mediapipe/tasks-vision/vision_bundle.mjs');
    console.log(VisionTasks);
  }
};

let visionWasm;
const requireWasm = async () => {
  await requireVisionTasks();
  visionWasm = await VisionTasks.FilesetResolver.forVisionTasks('../../../third-party/mediapipe/tasks-vision/wasm');
};

let faceDetector;
const requireFaceDetector = async () => {
  await requireWasm();
  return await VisionTasks.FaceDetector.createFromModelPath(visionWasm,
    "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
  );
};

let faceLandmarker;
const requireFaceLandmarker = async () => {
  await requireWasm();
  return faceLandmarker || (faceLandmarker = await VisionTasks.FaceLandmarker.createFromModelPath(visionWasm,
    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
  ));
};

let faceStylizer;
const requireFaceStylizer = async () => {
  await requireWasm();
  return faceStylizer || (faceStylizer = await VisionTasks.FaceStylizer.createFromModelPath(visionWasm,
    "https://storage.googleapis.com/mediapipe-models/face_stylizer/blaze_face_stylizer/float32/1/blaze_face_stylizer.task"
  ));
};

let handLandmarker;
const requireHandLandmarker = async () => {
  await requireWasm();
  return handLandmarker || (handLandmarker = await VisionTasks.HandLandmarker.createFromModelPath(visionWasm,
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
  ));
};

let gestureRecognizer;
const requireGestureRecognizer = async () => {
  await requireWasm();
  return gestureRecognizer || (gestureRecognizer = await VisionTasks.GestureRecognizer.createFromModelPath(visionWasm,
    "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
  ));
};

let objectDetector;
const requireObjectDetector = async () => {
  await requireWasm();
  return await VisionTasks.ObjectDetector.createFromModelPath(visionWasm,
    "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite"
  );
};

let imageSegmenter;
const requireImageSegmenter = async () => {
  await requireWasm();
  return await VisionTasks.ImageSegmenter.createFromModelPath(visionWasm,
    "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite"
  );
};

export const VisionTasksService = {
  async detectFace(layer, atom, {image}) {
    faceDetector ??= await requireFaceDetector();
    return {results: await this.imageTask(image, i => faceDetector.detect(i))};
  },
  async detectObject(layer, atom, {image}) {
    objectDetector ??= await requireObjectDetector();
    return {results: await this.imageTask(image, i => objectDetector.detect(i))};
  },
  async segmentImage(layer, atom, {image}) {
    imageSegmenter ??= await requireImageSegmenter();
    return {results: await this.imageTask(image, i => imageSegmenter.segment(i))};
  },
  async imageTask(image, task) {
    const realCanvas = this.marshalCanvas(image?.canvas);
    if (realCanvas) {
      // detect
      return task(realCanvas);
    }
  },
  marshalCanvas(id) {
    // get our input object
    const realCanvas = Resources.get(id);
    // confirm stability
    if (realCanvas && realCanvas.width && realCanvas.height) {
      return realCanvas;
    }
  }
};
