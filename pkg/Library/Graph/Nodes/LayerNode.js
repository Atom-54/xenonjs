/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const LayerNode = {
  Layer: {
    type: '$library/Graph/Atoms/Layer',
    inputs: ['graphId', 'graph', 'designable', 'composer'],
    outputs: ['layerId', 'io', 'data', 'graphId']
  }
};
