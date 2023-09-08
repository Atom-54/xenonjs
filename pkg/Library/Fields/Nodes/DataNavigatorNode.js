/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const DataNavigatorNode = {
  Form: {
    type: '$library/Fields/Atoms/DataNavigator',
    inputs: ['index', 'count', 'records', 'submittedRecord'],
    outputs: ['index', 'record', 'records']
  }
};
