/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Data';

export const LocalStorage = {
  LocalStorage: {
    categories: [category],
    displayName: 'Local Storage',
    description: 'Store and retrieve data from browser cache',
    ligature: 'save',
    type: '$anewLibrary/LocalStorage/Atoms/LocalStorage',
    inputs: {
      key: 'String',
      storeValue: 'Pojo'
    },
    outputs: {
      value: 'Pojo'
    }
  }
};