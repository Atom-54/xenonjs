/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'AI';

export const TensorFlowNodeTypes = {
  ObjectDetector: {
    categories: [category],
    description: 'Detects and classifies object(s) in the given image',
    displayName: 'Object Detector',
    type: `$anewLibrary/TensorFlow/Atoms/ObjectDetector`,
    ligature: 'detector',
    inputs: {
      image: 'Image',
      display: 'Image',
      options: 'Pojo'
    },
    outputs: {
      data: 'Pojo',
      display: 'Image'
    }
  }
};
