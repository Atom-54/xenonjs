/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Data';

export const LocalStorage = {
  ChromecastLauncher: {
    categories: [category, 'Media'],
    displayName: 'Chromecast Launcher',
    description: 'Connection to Chromecast device',
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