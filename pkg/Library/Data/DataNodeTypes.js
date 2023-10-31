/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Data';

export const DataNodeTypes = {
  Data: {
    category,
    description: 'Serves as a source of passthrough for JSON data',
    types: {
      Data$jsonDescription: 'is converted to JSON, if a String; otherwise returned as is'
    },
    type: '$library/Data/Nodes/DataNode'
  },
  CsvData: {
    category,
    description: 'Parse CSV text',
    type: '$library/Data/Nodes/CsvDataNode'
  },
  Gate: {
    category,
    description: 'Serves as a triggered passthrough for JSON data',
    types: {
      Gate$trigger: 'Nonce',
      Gate$jsonDescription: 'is converted to JSON, if a String; otherwise returned as is'
    },
    type: '$library/Data/Nodes/GateNode'
  },
  DataCollector: {
    category,
    description: 'Collect records',
    types: {
      //Data$jsonDescription: 'is converted to JSON, if a String; otherwise returned as is'
    },
    type: '$library/Data/Nodes/DataCollectorNode'
  },
  StringFormatter: {
    category,
    description: 'Formats given arguments into a string',
    types: {
      formatter$format: 'MultilineText',
      formatter$arg0: 'String',
      formatter$arg1: 'String',
      formatter$arg2: 'String',
      formatter$arg3: 'String',
      formatter$arg4: 'String',
      formatter$result: 'String'
    },
    type: '$library/Data/Nodes/StringFormatterNode'
  },
  RecordsCollector: {
    category,
    description: 'General purpose records manager, supporting addition, auto-generation, deletion and inspection of records',
    type: '$library/Data/Nodes/RecordsCollectorNode'
  },
  RecordsChart: {
    category,
    description: 'Displays records in a chart, sliced on a selected field',
    type: '$library/Data/Nodes/RecordsChartNode'
  },
  Chart: {
    category,
    description: 'Renders chart',
    types: {
      chart$type: 'String',
      chart$typeValues: ['bar', 'doughnut', 'pie', 'line']
    },  
    type: '$library/Data/Nodes/ChartNode'
  },
  Table: {
    category,
    description: 'Renders data in a table',
    type: '$library/Data/Nodes/TableNode'
  }
};
