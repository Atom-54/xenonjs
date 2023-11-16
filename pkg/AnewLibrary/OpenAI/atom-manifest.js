/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'OpenAI';

export const OpenAI = {
  OpenAIImage: {
    categories: [category, 'AI', 'Common'],
    displayName: 'OpenAI Image',
    description: 'Generates an image for the given prompt using OpenAI',
    type: '$anewLibrary/OpenAI/Atoms/OpenAIImage',
    // icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'image',
    inputs: {
      prompt: 'MultilineText',
      restart: 'Nonce:String',
      enabled: 'Boolean',
      options: 'Pojo'
    },
    outputs: {
      image: 'Image',
      working: 'Boolean'
    }
  },
  OpenAIText: {
    categories: [category],
    displayName: 'OpenAI Text',
    description: 'Generates text for the given prompt using OpenAI',
    type: '$anewLibrary/OpenAI/Atoms/OpenAIText',
    // icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'edit_note',
    inputs: {
      context:'MultilineText',
      prompt: 'MultilineText',
      enabled: 'Boolean',
      restart: 'Nonce:String',
    },
    outputs: {
      result: 'String',
      markup: 'String',
      working: 'Boolean'
    }
  },
  OpenAIChat: {
    categories: [category],
    displayName: 'OpenAI Chat',
    description: 'Prompts the OpenAI chat interface',
    type: '$anewLibrary/OpenAI/Atoms/OpenAIChat',
    // icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'sms',
    inputs: {
      messages: '[Message]'
    },
    outputs: {
      result: 'Pojo'
    }
  },
  OpenAISimpleChat: {
    categories: [category, 'AI', 'Common'],
    displayName: 'OpenAI Simple Chat',
    description: 'Prompts the OpenAI chat interface',
    type: '$anewLibrary/OpenAI/Atoms/OpenAISimpleChat',
    // icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'chat',
    inputs: {
      system: 'String', 
      assistant: 'String',
      user: 'String',
      go: 'Nonce',
      auto: 'Boolean',
      model: 'String',
      kTokens: 'Number',
      temperature: 'Number'
    },
    outputs: {
      result: 'String',
      working: 'Boolean'
    }
  },
  OpenAIImageCompletion: {
    categories: [category],
    displayName: 'OpenAI Image Completion',
    description: 'Completes the given image according to the requested prompt',
    type: '$anewLibrary/OpenAI/Atoms/OpenAIImageCompletion',
    // icon: '$library/Assets/nodes/openai-logomark.png',
    ligature: 'image',
    inputs: {
      prompt: 'String',
      image: 'Image',
      enabled: 'Boolean',
      restart: 'Nonce:String'
    },
    outputs:  {
      result: 'Image',
      working: 'Boolean'
    }
  }
};
