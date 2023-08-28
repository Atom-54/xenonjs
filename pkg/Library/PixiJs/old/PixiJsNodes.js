/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
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