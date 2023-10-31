/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const DelmerBotNode = {
  PersonaPanel: {
    type: '$library/AI/Atoms/PersonaPanel',
    inputs: ['profile']
  },
  OpenAIText: {
    type: '$library/OpenAI/Atoms/OpenAIText',
    inputs: ['prompt'],
    outputs: ['result'],
    bindings: {'context': 'PersonaPanel$context'},
    container: 'PersonaPanel#Container'
  },
  DelmerInput: {
    type: '$library/AI/Atoms/DelmerInput',
    inputs: ['mediaDeviceState'],
    outputs: ['mediaDeviceState'],
    container: 'PersonaPanel#Container'
  },
  SpeechRecognizer: {
    type: '$library/Media/Atoms/SpeechRecognizer',
    outputs: ['transcript'],
    bindings: {mediaDeviceState: 'DelmerInput$mediaDeviceState'}
  },
  state: {
    PersonaPanel$profile: {
      name: 'Delmer',
      avatar: '$library/AI/Assets/delmer.png',
      persona: 'Helpful and polite'
    }
  }
};

