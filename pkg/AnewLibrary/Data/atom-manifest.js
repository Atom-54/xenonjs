/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Data';

export const Data = {
  Data: {
    category,
    displayName: 'Data',
    ligature: 'scatter_plot',
    type: '$anewLibrary/Data/Atoms/Data.js',
    inputs: ['json'],
    outputs: ['data']
  },
  DataExplorer: {
    category,
    displayName: 'DataExplorer',
    ligature: 'explore',
    type: '$anewLibrary/Data/Atoms/DataExplorer.js',
    inputs: ['object', 'expandLevel'],
  }
};