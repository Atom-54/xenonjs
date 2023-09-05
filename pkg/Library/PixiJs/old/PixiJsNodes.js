/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */


export const PixiJsDemoNode = {
  $meta: {
    id: 'PixiJsDemoNode',
    displayName: 'PixiJs Multi Demo',
    category: 'Media'
  },
  $stores: {
    demoName: {
      $type: 'String',
      values: ['Spiral', 'Shader', 'BlendMode', 'Transparent', 'Tinting', 'CacheAsBitmap', 'SpineBoy']
    }
  },
  pixi: {
    $kind: '$library/PixiJs/PixiJs',
    $inputs: [{demo: 'demoName'}]
  }
};

export const PixiTextureNode = {
  $meta: {
    id: 'PixiTextureNode',
    displayName: 'Pixi Texture',
    category: 'Media'
  },
  $stores: {
    demoName: {
      noinspect: true
    },
    image: {
      $type: 'Image',
      connection: true
    }
  },
  pixi: {
    $kind: '$library/PixiJs/PixiJs',
    $inputs: ['image']
  }
};