/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAIImageNode = {
  OpenAIImage: {
    type: '$library/OpenAI/Atoms/OpenAIImage',
    inputs: ['prompt', 'restart', 'enabled', 'options'],
    outputs: ['image', 'working']
  }
};
