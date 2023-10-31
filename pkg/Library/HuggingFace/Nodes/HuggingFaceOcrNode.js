/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const HuggingFaceOcrNode = { 
  ocr: {
    type: '$library/HuggingFace/Atoms/HuggingFaceImageToText',
    inputs: ['image', 'model', 'options'],
    outputs: ['result', 'text', 'working']
  },
  state: {
    ocr$model: 'microsoft/trocr-base-handwritten'
  }
};
