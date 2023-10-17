/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Communication';

export const ChromecastNodeTypes = {
  ChromecastLauncher: {
    category,
    description: 'Connection to Chromecast device',
    types: {
      Launcher$composer: 'ComposerId:String'
    },  
    type: '$library/Chromecast/Nodes/ChromecastLauncherNode',
    ligature: 'cast'
  }
};