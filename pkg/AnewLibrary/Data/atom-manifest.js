/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const categories = ['Data'];

export const Data = {
  Data: {
    categories,
    displayName: 'Data',
    ligature: 'scatter_plot',
    type: '$anewLibrary/Data/Atoms/Data',
    inputs: {
      json: 'Pojo|Text',
    },
    outputs: {
      data: 'Pojo'
    }
  },
  DataExplorer: {
    categories,
    displayName: 'DataExplorer',
    ligature: 'explore',
    type: '$anewLibrary/Data/Atoms/DataExplorer',
    inputs: {
      object: 'Pojo',
      expandLevel: 'Number'
    }
  }
};