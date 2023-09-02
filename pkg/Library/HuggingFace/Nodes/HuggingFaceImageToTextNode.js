/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const HuggingFaceImageToTextNode = { 
  toText: {
    type: '$library/HuggingFace/Atoms/HuggingFaceImageToText',
    inputs: ['image', 'model', 'options', 'customModel'],
    outputs: ['result', 'text', 'working']
  },
  state: {
    toText$model: 'nlpconnect/vit-gpt2-image-captioning'
  }
};
