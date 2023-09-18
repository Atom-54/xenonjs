/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// [DEPRECATED] This node should be deprecated and replaced by TableNode.
// TODO(maria): Fix the public graphs and delete it!
export const GridNode = {
  chart: {
    type: '$library/Data/Atoms/ToastTable',
    inputs: ['columns', 'data', 'options'],
    outputs: ['event']
  },
  state: {
    chart$options: {
      rowHeaders: ['checkbox']
    }
  }
};
