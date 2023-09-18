/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Polymath';

export const PolymathNodeTypes = {
  AskPolymath: {
    category,
    description: `Query a Polymath library for information`,  
    types: {
      AskPolymath$query: 'MultilineText',
      AskPolymath$result: 'PolymathResult',
      AskPolymath$completion: 'MultilineText'
    },
    type: '$library/Polymath/Nodes/AskPolymathNode'
  }
};
