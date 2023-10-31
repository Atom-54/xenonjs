/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Data';

export const JSONataNodeTypes = {
  JSONata: {
    category,
    description: 'Queries or transforms the input JSON according to the given expression',
    types: {
      JSONata$expression: 'MultilineText'
    },  
    type: `$library/JSONata/Nodes/JSONataNode`
  }
};
