/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const LayerNode = {
  Layer: {
    type: '$library/Graph/Atoms/Layer',
    inputs: ['graph', 'graphJson', 'selectedProps', 'designable'],
    outputs: ['layerId', 'io', 'data']
  },
  state: {
  }
};
