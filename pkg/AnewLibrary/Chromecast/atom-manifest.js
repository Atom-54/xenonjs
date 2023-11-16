/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Chromecast';

export const Chromecast = {
  ChromecastLauncher: {
    categories: [category, 'Media'],
    displayName: 'Chromecast Launcher',
    description: 'Connection to Chromecast device',
    ligature: 'cast',
    type: '$anewLibrary/Chromecast/Atoms/ChromecastLauncher',
    outputs: {
      composer: 'ComposerId'
    }
  }
};