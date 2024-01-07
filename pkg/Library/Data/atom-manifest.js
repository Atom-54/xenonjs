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
    description: 'Passthrough the input, if JSON, or returns string parsed as JSON',
    ligature: 'scatter_plot',
    type: '$library/Data/Atoms/Data',
    inputs: {
      json: 'Pojo|String',
    },
    outputs: {
      value: 'Pojo'
    }
  },
  Form: {
    categories: [category],
    displayName: 'Form',
    description: 'Formulates a form',
    type: '$library/Data/Atoms/Form',
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
    type: '$library/Data/Atoms/DataNavigator',
    ligature: 'source_notes',
    inputs: {
      index: 'Number',
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
    description: 'Renders expandable JSON data visualization',
    ligature: 'explore',
    type: '$library/Data/Atoms/DataExplorer',
    inputs: {
      object: 'Pojo',
      expandLevel: 'Number'
    }
  },
  ServiceAccess: {
    categories: [category],
    displayName: 'Service Access',
    description: 'Provides access to a Service call',
    ligature: 'joystick',
    type: '$library/Data/Atoms/ServiceAccess',
    inputs: {
      service: 'String',
      task: 'String',
      data: 'Pojo',
      interval: 'Number'
    },
    outputs: {
      result: 'Pojo'
    }
  },
  CsvData: {
    categories: [category],
    description: 'Parses CSV text',
    type: '$library/Data/Atoms/CsvData',
    ligature: 'data_table',
    inputs: {
      csv: 'String',
      url: 'String', 
    },
    outputs: {
      lines: '[Pojo]'
    }
  },
  Chart: {
    categories: [category],
    description: 'Renders chart',
    type: '$library/Data/Atoms/Chart',
    ligature: 'area_chart',
    inputs: {
      type: 'TypeValues|String',
      data: '[Pojo]',
      options: '[Pojo]'      
    },
    types: {
      TypeValues: ['bar', 'doughnut', 'pie', 'line']
    }  
  },
  Table: {
    categories: [category],
    displayName: 'Toast Table',
    description: 'Renders data in a table',
    type: '$library/Data/Atoms/Table',
    ligature: 'table',
    inputs: {
      columns: '[Pojo]',
      data: '[Pojo]',
      options: '[Pojo]'
    },
    outputs: {
      event: 'Pojo'
    },
    state: {
      options: {
        rowHeaders: ['checkbox']
      }
    }
  },
  Gate: {
    categories: [category],
    description: 'Serves as a triggered passthrough for JSON data',
    type: '$library/Data/Atoms/Gate',
    ligature: 'outdoor_garden',
    inputs: {
      json: 'Pojo',
      trigger: 'Nonce'
    },
    outputs: {
      value: 'Pojo'
    }
  },
  Iterator: {
    categories: [category],
    description: 'JSON data iterator',
    type: '$library/Data/Atoms/Iterator',
    ligature: 'steppers',
    inputs: {
      source: 'String',
      stride: 'String|Number',
      response: '[Pojo]'
    },
    outputs: {
      data: 'Pojo',
      results: 'Pojo'
    }
  },
  StringFormatter: {
    categories: [category],
    displayName: 'String Formatter',
    description: 'Formats given arguments into a string',
    type: '$library/Data/Atoms/StringFormatter',
    ligature: 'regular_expression',
    inputs: {
      format: 'MultilineText',
      arg0: 'String',
      arg1: 'String',
      arg2: 'String',
      arg3: 'String',
      arg4: 'String',
    },
    outputs: {
      result: 'String'
    }
  },
  PathCombiner: {
    categories: [category],
    displayName: 'Path Combiner',
    description: 'Formats given arguments into a path',
    type: '$library/Data/Atoms/PathCombiner',
    ligature: 'regular_expression',
    inputs: {
      arg0: 'String',
      arg1: 'String',
      arg2: 'String',
      arg3: 'String',
      arg4: 'String'
    },
    outputs: {
      result: 'String'
    }
  }
};
