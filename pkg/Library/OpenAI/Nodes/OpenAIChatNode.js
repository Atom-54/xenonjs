/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAIChatNode = {
  OpenAIChat: {
    type: '$library/OpenAI/Atoms/OpenAIChat',
    inputs: ['messages'],
    outputs: ['result']
  }
};