/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'PixiJs';

export const PixiJsNodeTypes = {
  PixiApp: {
    category,
    types: {
      PixiApp$app: 'PixiAppId',
      PixiApp$active: 'Boolean'
    },
    type: '$library/PixiJs/Nodes/PixiAppNode'
  },
  PixiSprite: {
    category,
    types: {
      PixiSprite$app: 'PixiAppId',
      PixiSprite$from: 'String',
      PixiSprite$x: 'Number',
      PixiSprite$y: 'Number',
      PixiSprite$s: 'Number',
      PixiSprite$r: 'Number',
      PixiSprite$z: 'Number'
    },
    type: '$library/PixiJs/Nodes/PixiSpriteNode'
  },
  PixiStream: {
    category,
    types: {
      PixiStream$app: 'PixiAppId',
      PixiStream$stream: 'Stream'
    },
    type: '$library/PixiJs/Nodes/PixiStreamNode'
  },
  // PixiDemo: {
  //   category,
  //   types: {
  //     pixiDemo$demo: 'String',
  //     pixiDemo$demoValues: ['Spiral', 'Shader', 'BlendMode', 'Transparent', 'Tinting', 'CacheAsBitmap', 'SpineBoy']
  //   },
  //   type: '$library/PixiJs/Nodes/PixiDemoNode'
  // },
  // PixiSpineBoyPro: {
  //   category,
  //   type: '$library/PixiJs/Nodes/PixiSpineBoyProNode'
  // },
  // PixiNuPogodi: {
  //   category,
  //   types: {
  //     nupogodi$app: 'PixiAppId'
  //   },
  //   type: '$library/PixiJs/Nodes/PixiNuPogodiNode'
  // }
};
