/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const RecordsTableNode = {
  records: {
    type: '$library/Data/Atoms/RecordsTable',
    inputs: ['records', 'data'],
    outputs: ['event', 'selected']
  }
};
