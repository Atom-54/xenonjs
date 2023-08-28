/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const RecordsChartNode = {
  formatter: {
    type: '$library/Data/Atoms/RecordsChart',
    inputs: ['records', 'schema'],
  },
  chart: {
    type: '$library/Data/Atoms/Chart',
    bindings: {
      type: 'formatter$type',
      data: 'formatter$data', 
      options: 'formatter$options'
    },
    container: 'formatter#chart'
  }
};
