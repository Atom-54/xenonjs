/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import '../Dom/pixi-sprite.js';

export const PixiSpriteNode = {
  PixiSprite: {
    type: '$library/PixiJs/Atoms/PixiSprite',
    inputs: ['app', 'from', 'reset', /*'x', 'y', 's'*/, 'r']
  }
};
