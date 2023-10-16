/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Communication';

export const ChromecastNodeTypes = {
  ChromecastLauncher: {
    category,
    description: 'Displays and edits source code',
    types: {
      text$text: 'MultilineText'
    },  
    type: '$library/Chromecast/Nodes/ChromecastLauncherNode',
    icon: '$library/Assets/nodes/codemirror.png',
    ligature: 'cast'
  }
};