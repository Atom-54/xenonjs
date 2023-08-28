/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const LocalStorageNode = {
  LocalStorage: {
    type: '$library/LocalStorage/Atoms/LocalStorage',
    inputs: ['key', 'storeValue'],
    outputs: ['value']
  }
};
