/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import '../Dom/pixi-sprite-grid.js';

export const PixiGemsNode = {
  PixiGems: {
    type: '$library/Games/Atoms/PixiGems',
    inputs: ['app', 'bundle', 'rows', 'cols', 'size', 'margin', 's', 'z']
  },
  state: {
    PixiGems$cols: 6,
    PixiGems$rows: 6,
    PixiGems$size: 64,
    PixiGems$margin: 8
  }
};