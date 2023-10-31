/**
 * @license
 * Copyright 2023 Atom54 LLC
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
      OpenAIImage$restart: 'Nonce:String',
      OpenAIImage$enabled: 'Boolean',
      OpenAIImage$working: 'Boolean'
    },
    type: '$library/OpenAI/Nodes/OpenAIImageNode',
    icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'image',
  },
  OpenAIText: {
    category,
    description: 'Generates text for the given prompt using OpenAI',
    types: {
      OpenAIText$context: 'MultilineText',
      OpenAIText$prompt: 'MultilineText',
      OpenAIText$result: 'String',
      OpenAIText$enabled: 'Boolean',
      OpenAIText$restart: 'Nonce:String',
      OpenAIText$markup: 'String',
      OpenAIText$working: 'Boolean'
    },
    type: '$library/OpenAI/Nodes/OpenAITextNode',
    icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'edit_note'
  },
  OpenAIChat: {
    category,
    description: 'Prompts the OpenAI chat interface',
    types: {
      OpenAIChat$messages: '[Message]'
    },
    type: '$library/OpenAI/Nodes/OpenAIChatNode',
    icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'sms'
  },
  OpenAISimpleChat: {
    category,
    description: 'Prompts the OpenAI chat interface',
    types: {
      OpenAISimpleChat$go: 'Nonce',
      OpenAISimpleChat$system: 'String',
      OpenAISimpleChat$assistant: 'String',
      OpenAISimpleChat$user: 'String',
      OpenAISimpleChat$result: 'String',
      OpenAISimpleChat$working: 'Boolean'
    },
    type: '$library/OpenAI/Nodes/OpenAISimpleChatNode',
    icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'chat'
  },
  OpenAIImageCompletion: {
    category,
    description: 'Completes the given image according to the requested prompt',
    types: {
      complete$prompt: 'String',
      complete$image: 'Image',
      complete$enabled: 'Boolean',
      complete$restart: 'Nonce:String',
      complete$result: 'Image',
      complete$working: 'Boolean'
    },
    type: '$library/OpenAI/Nodes/OpenAIImageCompletionNode',
    icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'image'
  }
};
