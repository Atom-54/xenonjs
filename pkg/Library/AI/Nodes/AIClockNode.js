/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const AIClockNode = {
  AIClock: {
    type: '$library/AI/Atoms/AIClock',
    inputs: ['enabled', 'mood', 'refresh'],
    outputs: ['enabled', 'mood', 'displayTime'],
    bindings: {
      text: 'OpenAIText$result',
      image: 'OpenAIImage$image'
    }
  },
  OpenAIText: {
    type: '$library/OpenAI/Atoms/OpenAIText',
    inputs: ['context'], 
    bindings: {
      enabled: 'AIClock$enabled',
      context: 'AIClock$context',
      prompt: 'AIClock$prompt',
      restart: 'AIClock$refresh'
    }
  },
  OpenAIImage: {
    type: '$library/OpenAI/Atoms/OpenAIImage',
    inputs: ['options'], 
    bindings: {
      enabled: 'AIClock$enabled',
      prompt: 'AIClock$prompt'
    }
  }
};