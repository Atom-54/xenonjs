/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'DevTools';

export const DevTools = {
  DevTools: {
    categories: [category],
    description: 'Runtime information panels for developers',
    ligature: 'handyman',
    type: '$anewLibrary/DevTools/Atoms/DevTools',
    inputs: {
      graphs: '[Graph]',
      show: 'Boolean'
    }
  }
};