/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Media';

export const ShaderNodeTypes = {
  FragmentShader: {
    category,
    description: 'Applies the shader effect to an image',
    types: {
      shader$shader: 'MultilineText',
      shader$image: 'Image',
      shader$image2: 'Image',
      shader$image3: 'Image',
      shader$image4: 'Image',
      shader$outputImage: 'Image',
      shader$defaultShader: 'String',
      shader$defaultShaderValues: ["Wheatley's Lake", "Fire!", "Heartfelt Rainy Window", "Leon Denise's Glitch", "Raja's Matrix Rain", "Crazy Road"] 
    },
    type: `$library/Shader/Nodes/FragmentShaderNode`
  }
};