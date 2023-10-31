/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'AI';

export const PolymathNodeTypes = {
  PolymathAIO: {
    category,
    description: `TextEmbedding creates a 'vector' from it's input
      that creates a context for Polymath to study
      against it's endpoints.
      
      Polymath consumes the 'vector' and produces the
      mysterious 'bits' structure.
      
      PromptMaker consumes the 'bits' a (prompt) 'template'
      and outputs the also mysterious 'prompt.`,  
    types: {
      OpenAIText$restart: 'Boolean',
      PromptMaker$query: 'String',
      Polymath$bits: 'PolymathBits'
    },
    type: '$library/Polymath/Nodes/PolymathAIONode'
  },
  Polymath: {
    category,
    description: 'Consumes the `vector` and produces the mysterious `bits` structure',
    types: {
      Polymath$vector: 'EmbeddingVector',
      Polymath$bits: 'PolymathBits'
    },
    type: '$library/Polymath/Nodes/PolymathNode'
  },
  PromptMaker: {
    category,
    description: 'Creates a prompt from the given `template` and `query`',
    types: {
      PromptMaker$template: 'String',
      PromptMaker$bits: 'PolymathBits',
      PromptMaker$query: 'String',
      PromptMaker$prompt: 'String'
    },
    type: '$library/Polymath/Nodes/PromptMakerNode'
  },
  TextEmbedding: {
    category,
    description: 'Creates a `vector` from its input that creates a context for Polymath to study against its endpoints',
    types: {
      TextEmbedding$vector: 'EmbeddingVector',
      TextEmbedding$text: 'String'
    },
    type: '$library/Polymath/Nodes/TextEmbeddingNode'
  }
};
