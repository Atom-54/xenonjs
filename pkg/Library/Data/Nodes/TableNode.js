/**
 * @license
 * Copyright 2023 Atom54 LLC
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
