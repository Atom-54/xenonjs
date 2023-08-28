/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const AIClockNode = {
  AIClock: {
    type: '$library/AI/Atoms/AIClock',
    inputs: ['live', 'mood'],
    outputs: ['live', 'mood', 'displayTime'],
    bindings: {
      text: 'OpenAIText$result',
      image: 'OpenAIImage$image'
    }
  },
  OpenAIText: {
    type: '$library/OpenAI/Atoms/OpenAIText',
    inputs: ['context'], 
    bindings: {
      context: 'AIClock$context',
      prompt: 'AIClock$prompt'
    }
  },
  OpenAIImage: {
    type: '$library/OpenAI/Atoms/OpenAIImage',
    inputs: ['context', 'options'], 
    bindings: {
      restart: 'AIClock$live',
      prompt: 'OpenAIText$result'
    }
  },
  // ImageResizer: {
  //   type: '$library/Media/Atoms/ImageResizer',
  //   inputs: ['image', 'size'],
  //   outputs: ['resizedImage'],
  //   bindings: {
  //     image: 'OpenAIImage$image'
  //   }
  // },
  state: {
    AIClock$live: true,
    OpenAIText$context: `Compose a rhyming couplet, in iambic pentameter, including the given time. After writing the couplet, review it for correct meter and rhyme, then write it again to fix any mistakes.`,
    //OpenAIText$context: 'You are the Great Wizard Gandalf, incant a spell about the given subject.',
    //OpenAIText$context: 'Compose a rhyming couplet, in iambic pentameter, including the given time.',
    //OpenAIText$context: 'Compose a rhyming couplet including the given time.'
    //ImageResizer$size: {width: 128, height: 128}
  }
};