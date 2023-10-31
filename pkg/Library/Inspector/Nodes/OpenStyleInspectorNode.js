/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const OpenStyleInspectorNode = {
  inspector: {
    type: '$library/Inspector/Atoms/OpenStyleInspector',
    inputs: ['data', 'key', 'propName', 'flairs'],
    outputs: ['data'],
  },
  state: {
    inspector$propName: 'CssStyle'
  }
};
