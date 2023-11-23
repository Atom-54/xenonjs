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
      value: 'Pojo'
    }
  },
  Form: {
    categories: [category],
    displayName: 'Form',
    description: 'Formulates a form',
    type: '$anewLibrary/Data/Atoms/Form',
    ligature: 'ballot',
    inputs: {
      inputData: 'Pojo',
      submitTrigger: 'Nonce'
    },
    outputs: {
      form: 'FormId',
      schema: '[Pojo]',
      columns: '[Pojo]',
      row: 'Pojo',
      preview: 'Pojo'
    }
  },  
  DataNavigator: {
    categories: [category],
    displayName: 'Data Navigator',
    description: 'UX for navigating a dataset',
    type: '$anewLibrary/Data/Atoms/DataNavigator',
    ligature: 'source_notes',
    inputs: {
      index: 'Number',
      count: 'Number',
      records: '[Pojo]',
      submittedRecord: 'Pojo'
    },
    outputs: {
      index: 'Number',
      record: 'Pojo',
      records: '[Pojo]'
    },
    state: {
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
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
      data: 'Pojo',
      interval: 'Number'
    },
    outputs: {
      result: 'Pojo'
    }
  }
};