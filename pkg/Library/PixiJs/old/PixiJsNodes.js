/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */


export const PixiJsDemoNode = {
  pixi: {
    $kind: '$library/PixiJs/PixiJs',
    $inputs: [{demo: 'demoName'}]
  }
};

export const PixiTextureNode = {
  pixi: {
    $kind: '$library/PixiJs/PixiJs',
    $inputs: ['image']
  }
};