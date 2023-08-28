/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAIImageCompletionNode = {
  complete: {
    type: '$library/OpenAI/Atoms/OpenAIImageCompletion',
    inputs: ['prompt', 'image'],
    outputs: ['result', 'working']
  }
};
