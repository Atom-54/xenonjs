/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const HuggingFaceImageNode = {
  HuggingFace: {
    type: '$library/HuggingFace/Atoms/HuggingFaceImage',
    inputs: ['prompt', 'textToImageModel', 'options', 'trigger'],
    outputs: ['image', 'working']
  }
};
