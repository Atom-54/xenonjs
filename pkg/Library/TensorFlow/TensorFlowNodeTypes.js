/**
 * @license
 * Copyright 2023 Atom54 LLC
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
    type: `$library/TensorFlow/Nodes/ObjectDetectorNode`,
    icon: '$library/Assets/nodes/tensorflow-logo.png',
    ligature: 'detector'
  }
};