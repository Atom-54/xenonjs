/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PersonaChatNode = {
  PersonaChat: {
    type: '$library/AI/Atoms/PersonaChat',
    inputs: ['personas', 'topic', 'rounds', 'restart'], 
    outputs: ['transcript', 'markup'],
    bindings: {
      result: 'OpenAIText$result'
    }
  },
  OpenAIText: {
    type: '$library/OpenAI/Atoms/OpenAIText',
    // bindings are inputs... my private input comes from target private output
    bindings: {
      prompt: 'PersonaChat$openAIPrompt',
      image: 'PersonaChat$prompt',
      context: 'PersonaChat$context'
    }
  }
};

