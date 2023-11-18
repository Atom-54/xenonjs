/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Json';

export const Json = {
  JSONata: {
    categories: [category, 'Data'],
    description: 'Queries or transforms the input JSON according to the given expression',
    type: '$anewLibrary/Json/Atoms/JSONata',
    inputs: {
      json: 'Pojo',
      expression: 'Text'
    },
    outputs: {
      result: 'Pojo'
    }
  }
};
