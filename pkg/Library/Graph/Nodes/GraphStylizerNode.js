/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const GraphStylizerNode = {
  // types: {
  //   graph: 'Graph',
  //   restart: 'Boolean',
  //   avatars: 'String',
  //   avatarsValues: ['Elders','PetBots','SuperBots'],
  // },
  GraphStylizer: {
    type: '$library/Graph/Atoms/GraphStylizer',
    inputs: ['avatars', 'avatar', 'graph'],
    outputs: ['graph'],
    bindings: {
      image: 'AIImage$image'
    }
  },
  AIImage: {
    //type: '$library/OpenAI/Atoms/OpenAIImage',
    type: '$library/HuggingFace/Atoms/HuggingFace',
    inputs: ['textToImageModel'],
    bindings: {
      restart: 'GraphStylizer$restart',
      prompt: 'GraphStylizer$prompt'
    }
  },
  state: {
    AIImage$textToImageModel: 'prompthero/openjourney-v4',
    GraphStylizer$avatars: {
      'Elders': 'portrait of a wise sage, dreamy and ethereal, expressive pose, big dark eyes, exciting expression, fantasy, intricate, elegant, dark and moody smoke, highly detailed, digital painting, art station, concept art, smooth, sharp focus, illustration, art by guy denning.',
      'SuperBots': 'portrait of an Android Action Hero of mixed race of any gender. Airy, vintage ad, sci-fi, steam punk, very detailed, realistic, figurative painter, fine art, Oil painting on canvas, beautiful painting by Daniel F Gerhartz.',
      'SuperPets': 'cutest AND softest creature in the world| large doll like eyes| supernatural and otherworldly| highly detailed vibrant fur| magical glowing trails| light dust| aesthetic| cinematic lighting| bokeh effect'
      //'SuperBots': 'Striking portrait photo of an android action hero character of mixed-race of any gender.',
      //'SuperPets': 'Striking portrait photo of a super-hero Pet with a helpful face, against a simple background.',
      //'PetBots': 'Striking portrait photo of a Dog or Cat android action hero character.',
      //'TechnoPets': 'Portrait photo of techno Dog or Cat, at night, blurred neon techno city.' 
    }
  }
};
