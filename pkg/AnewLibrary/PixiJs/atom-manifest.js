/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'PixiJs';

export const PixiJs = {
  PixiApp: {
    categories: [category],
    displayName: 'A surface for PixiJs rendering',
    ligature: 'toys',
    type: '$anewLibrary/PixiJs/Atoms/PixiApp',
    inputs: {
      active: 'Boolean'
    },
    outputs: {
      app: 'PixiAppId',
      frame: 'Image'
    }
  },
  PixiSprite: {
    categories: [category],
    displayName: 'A PixiJs sprite',
    ligature: 'playing_cards',
    type: '$anewLibrary/PixiJs/Atoms/PixiSprite',
    inputs: {
      app: 'PixiAppId',
      from: 'String',
      x: 'Number',
      y: 'Number',
      r: 'Number',
      s: 'Number',
      z: 'Number'
    },
    outputs: {
      app: 'PixiAppId',
      frame: 'Image'
    }
  },
  PixiGems: {
    categories: [category],
    description: 'PixiJs gems layout',
    ligature: 'crossword',
    inputs: {
      app: 'PixiAppId',
      bundle: 'Json',
      rows: 'Number',
      cols: 'Number',
      size: 'Number',
      margin: 'Number',
      s: 'Number',
      z: 'Number'
    },
    type: '$anewLibrary/PixiJs/Atoms/PixiGems'
  }
};