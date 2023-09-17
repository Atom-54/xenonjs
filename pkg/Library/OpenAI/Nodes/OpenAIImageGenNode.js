/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAIImageGenNode = {
  OpenAIImage: {
    type: '$library/OpenAI/Atoms/OpenAIImage',
    inputs: ['prompt', 'enabled', 'restart', 'options'],
    outputs: ['image', 'working']
  }
};
