/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAITextNode = {
  OpenAIText: {
    type: '$library/OpenAI/Atoms/OpenAIText',
    inputs: ['context', 'prompt', 'restart'],
    outputs: ['result', 'markup', 'restart', 'working'] //, 'restart' - it's not a public output?
  }
};