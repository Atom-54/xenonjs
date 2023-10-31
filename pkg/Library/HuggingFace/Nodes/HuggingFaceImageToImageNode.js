/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const HuggingFaceImageToImageNode = {
  HuggingFace: {
    type: '$library/HuggingFace/Atoms/HuggingFaceImageToImage',
    inputs: ['image', 'active', 'prompt', 'imageToImageModel', 'options'],
    outputs: ['outputImage', 'working']
  }
};
