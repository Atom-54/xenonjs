/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const HuggingFaceImageNode = {
  HuggingFace: {
    type: '$library/HuggingFace/Atoms/HuggingFaceImage',
    inputs: ['prompt', 'textToImageModel', 'options', 'trigger'],
    outputs: ['image', 'working']
  }
};
