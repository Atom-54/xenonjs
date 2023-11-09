/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Data';

export const Data = {
  DataExplorer: {
    category,
    type: '$anewLibrary/Data/Atoms/DataExplorer.js',
    inputs: ['object', 'expandLevel'],
    // inputs: {
    //   layout: 'LayoutValues|String',
    //   center: 'Boolean',
    //   style: 'CSSStyle'
    // },
    // layoutValues: ['column','row'],
    // state: {
    //   panel$layout: 'column'
    // },
    //description: 'Renders a simple panel that can contain elements',
    ligature: 'explore'
  }
};