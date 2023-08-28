/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const ObjectDetectorNode = {
  ObjectDetector: {
    type: '$library/TensorFlow/Atoms/ObjectDetector',
    inputs: ['image', 'display'],
    outputs: ['data', 'display']
  }
};
