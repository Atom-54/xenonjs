/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const ObjectDetectorNode = {
  ObjectDetector: {
    type: '$library/TensorFlow/Atoms/ObjectDetector',
    inputs: ['image', 'display', 'options'],
    outputs: ['data', 'display']
  }
};
