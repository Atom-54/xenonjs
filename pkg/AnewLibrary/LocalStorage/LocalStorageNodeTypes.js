/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Data';

export const LocalStorageNodeTypes = {
  LocalStorage: {
    category,
    description: 'Stores the given value in the browser local storage',
    types: {
      LocalStorage$key: 'String'
    },
    type: '$library/LocalStorage/Nodes/LocalStorageNode'
  }
};
