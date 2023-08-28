/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenAIImageNode = {
  OpenAIImage: {
    type: '$library/OpenAI/Atoms/OpenAIImage',
    // makes `prompt` a "public" property for this Node
    inputs: ['prompt', 'restart', 'options'],
    outputs: ['image', 'working']
    //outputs: ['restart']
  },
  // Image: {
  //   type: '$library/Media/Atoms/Image',
  //   // my private input `image`, comes 
  //   // from `OpenAIImage`'s private output `image`
  //   bindings: {image: 'OpenAIImage$image'},
  //   // "public" output for the Node is this one
  //   outputs: ['image']
  // }
};
