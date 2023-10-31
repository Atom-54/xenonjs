/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAIImageCompletionNode = {
  complete: {
    type: '$library/OpenAI/Atoms/OpenAIImageCompletion',
    inputs: ['prompt', 'image', 'enabled', 'restart'],
    outputs: ['result', 'working']
  }
};
