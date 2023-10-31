/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const RecordsCollectorNode = {
  collect: {
    type: '$library/Data/Atoms/RecordsCollector',
    inputs: ['schema', 'record', 'records', 'data', 'event', 'response'],
    outputs: ['record', 'records', 'data', 'event', 'request']
  }
};
