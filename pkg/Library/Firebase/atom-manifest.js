/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Data';

export const FirebaseRealtime = {
  FirebaseRealtime: {
    categories: [category],
    displayName: 'Firebase Realtime',
    description: 'Store and retrieve data from Firebase Realtime Database',
    ligature: 'save',
    type: '$library/Firebase/Atoms/FirebaseRealtime',
    inputs: {
      key: 'String',
      storeValue: 'Pojo'
    },
    outputs: {
      value: 'Pojo'
    }
  }
};