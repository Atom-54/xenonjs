/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAITextNode = {
  OpenAIText: {
    type: '$library/OpenAI/Atoms/OpenAIText',
    inputs: ['context', 'prompt', 'enabled', 'restart'],
    outputs: ['result', 'markup', 'working']
  }
};