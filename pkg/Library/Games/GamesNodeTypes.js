/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Games';

export const GamesNodeTypes = {
  PixiGems: {
    category: 'PixiJs',
    description: 'Pixi gems gaming',
    types: {
      PixiGems$app: 'PixiAppId',
      PixiGems$bundle: 'PixiSpriteBundle',
      PixiGems$rows: 'Number',
      PixiGems$cols: 'Number',
      PixiGems$size: 'Number',
      PixiGems$margin: 'Number',
      PixiGems$s: 'Number',
      PixiGems$z: 'Number'
    },
    type: '$library/Games/Nodes/PixiGemsNode'
  }
};
