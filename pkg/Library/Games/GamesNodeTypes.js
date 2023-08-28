/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Games';

export const GamesNodeTypes = {
  PixiGems: {
    category,
    description: 'Pixi gems gaming',
    types: {
      PixiApp$app: 'PixiAppId'
    },
    type: '$library/Games/Nodes/PixiGemsNode'
  }
};
