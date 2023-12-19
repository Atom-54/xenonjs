/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Documents';

export const Documents = {
  Folders: {
    categories: [category, 'Common'],
    displayName: 'Folders',
    ligature: 'folder',
    type: '$library/Documents/Atoms/Folders',
    inputs: {
      storeId: 'String',
    },
    outputs: {
      folders: 'Json|Folders'
    }
  }
};
