/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const TableNode = {
  Table: {
    type: '$library/Data/Atoms/ToastTable',
    inputs: ['columns', 'data', 'options'],
    outputs: ['event']
  },
  state: {
    Table$options: {
      rowHeaders: ['checkbox']
    }
  }
};
