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
    // icon: '$anewLibrary/Assets/nodes/openai-logomark.png',
    ligature: 'image',
    inputs: {
      prompt: 'Text',
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
    // icon: '$anewLibrary/Assets/nodes/openai-logomark.png',
    ligature: 'edit_note',
    inputs: {
      context:'Text',
      prompt: 'Text',
      enabled: 'Boolean',
      restart: 'Nonce',
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
    // icon: '$anewLibrary/Assets/nodes/openai-logomark.png',
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
    // icon: '$anewLibrary/Assets/nodes/openai-logomark.png',
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
    // icon: '$anewLibrary/Assets/nodes/openai-logomark.png',
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
