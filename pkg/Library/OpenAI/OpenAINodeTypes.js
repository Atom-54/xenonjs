/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'AI';

export const OpenAINodeTypes = {
  OpenAIImage: {
    category,
    description: 'Generates an image for the given prompt using OpenAI',
    types: {
      OpenAIImage$prompt: 'MultilineText',
      Image$image: 'Image',
      OpenAIImage$restart: 'Nonce|String',
      OpenAIImage$working: 'Boolean'
    },
    type: '$library/OpenAI/Nodes/OpenAIImageNode'
  },
  OpenAIText: {
    category,
    description: 'Generates text for the given prompt using OpenAI',
    types: {
      OpenAIText$context: 'MultilineText',
      OpenAIText$prompt: 'MultilineText',
      OpenAIText$result: 'String',
      OpenAIText$restart: 'Nonce|String',
      OpenAIText$markup: 'String',
      OpenAIText$working: 'Boolean'
    },
    type: '$library/OpenAI/Nodes/OpenAITextNode'
  },
  OpenAIChat: {
    category,
    description: 'Generates an image for the given prompt using the newer OpenAI API',
    types: {
      OpenAIChat$messages: '[Message]'
    },
    type: '$library/OpenAI/Nodes/OpenAIChatNode'
  },
  OpenAISimpleChat: {
    category,
    description: 'Prompts the OpenAI chat interface',
    types: {
      OpenAISimpleChat$system: 'String',
      OpenAISimpleChat$assistant: 'String',
      OpenAISimpleChat$user: 'String',
      OpenAISimpleChat$on: 'Boolean',
      OpenAISimpleChat$result: 'String',
      OpenAISimpleChat$working: 'Boolean'
    },
    type: '$library/OpenAI/Nodes/OpenAISimpleChatNode'
  },
  OpenAIImageCompletion: {
    category,
    description: 'Completes the given image according to the requested prompt',
    types: {
      complete$prompt: 'String',
      complete$image: 'Image',
      complete$restart: 'Nonce|String',
      complete$result: 'Image',
      complete$working: 'Boolean'
    },
    type: '$library/OpenAI/Nodes/OpenAIImageCompletionNode'
  }
};
