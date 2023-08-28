/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAIImageGenNode = {
  OpenAIImage: {
    type: '$library/OpenAI/Atoms/OpenAIImage',
    // makes `prompt` a "public" property for this Node
    inputs: ['prompt', 'restart', 'options'],
    outputs: ['image', 'working']
  }
};
