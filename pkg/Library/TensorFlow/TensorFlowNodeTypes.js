/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'AI';

export const TensorFlowNodeTypes = {
  ObjectDetector: {
    category,
    description: 'Detects and classifies object(s) in the given image',
    types: {
      ObjectDetector$image: 'Image'
    },
    type: `$library/TensorFlow/Nodes/ObjectDetectorNode`
  }
};