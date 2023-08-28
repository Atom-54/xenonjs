/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PromptMakerNode = {
  PromptMaker: {
    type: '$library/Polymath/Atoms/PromptMaker',
    inputs: ['template', 'bits', 'query'],
    outputs: ['prompt']
  },
  state: {
    PromptMaker$template: '${context} ${query}'
  }
};