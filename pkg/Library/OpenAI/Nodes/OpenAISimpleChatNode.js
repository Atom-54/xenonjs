/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAISimpleChatNode = {
  OpenAISimpleChat: {
    type: '$library/OpenAI/Atoms/OpenAISimpleChat',
    inputs: ['system', 'assistant', 'user', 'go'],
    outputs: ['result', 'working']
  }
};