/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAISimpleChatNode = {
  OpenAISimpleChat: {
    type: '$library/OpenAI/Atoms/OpenAISimpleChat',
    inputs: ['system', 'assistant', 'user', 'on'],
    outputs: ['result', 'working']
  }
};