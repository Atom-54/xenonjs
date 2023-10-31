/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PolymathAIONode = {
  //
  // TextEmbedding creates a 'vector' from it's input
  // that creates a context for Polymath to study
  // against it's endpoints.
  //
  // Polymath consumes the 'vector' and produces the
  // mysterious 'bits' structure.
  //
  // PromptMaker consumes the 'bits' a (prompt) 'template'
  // and outputs the also mysterious 'prompt.
  //
  TextEmbedding: {
    type: '$library/Polymath/Atoms/TextEmbedding',
    inputs: ['text']
  },
  Polymath: {
    type: '$library/Polymath/Atoms/Polymath',
    inputs: ['endpoints'],
    outputs: ['error', 'bits'],
    bindings: {
      vector: 'TextEmbedding$vector'
    }
  },
  PromptMaker: {
    type: '$library/Polymath/Atoms/PromptMaker',
    inputs: ['template', 'query'],
    outputs: ['prompt'],
    bindings: {
      bits: 'Polymath$bits'
    }
  },
  OpenAIText: {
    type: '$library/OpenAI/Atoms/OpenAIText',
    inputs: ['restart', 'context'],
    outputs: ['result'],
    bindings: {
      prompt: 'PromptMaker$prompt'
    },
    state: {
      restart: true,
      context: 'Be polite and helpful.'
    }
  }  
};