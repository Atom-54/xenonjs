/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const GridNode = {
  chart: {
    type: '$library/Data/Atoms/Table',
    inputs: ['columns', 'data', 'options'],
    outputs: ['event']
  },
  state: {
    chart$options: {
      rowHeaders: ['checkbox']
    }
  }
};
