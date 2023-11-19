/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Data';

export const Data = {
  Data: {
    categories: [category, 'Common'],
    displayName: 'Data',
    ligature: 'scatter_plot',
    type: '$anewLibrary/Data/Atoms/Data',
    inputs: {
      json: 'Pojo',
    },
    outputs: {
      data: 'Pojo'
    }
  },
  DataExplorer: {
    categories: [category],
    displayName: 'Data Explorer',
    ligature: 'explore',
    type: '$anewLibrary/Data/Atoms/DataExplorer',
    inputs: {
      object: 'Pojo',
      expandLevel: 'Number'
    }
  },
  ServiceAccess: {
    categories: [category],
    displayName: 'Service Access',
    ligature: 'joystick',
    type: '$anewLibrary/Data/Atoms/ServiceAccess',
    inputs: {
      service: 'String',
      task: 'String',
      data: 'Pojo'
    },
    outputs: {
      result: 'Pojo'
    }
  }
};