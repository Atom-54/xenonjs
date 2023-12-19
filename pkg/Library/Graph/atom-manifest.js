/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const categories = ['Graph'];

export const Graph = {
  Graph: {
    categories,
    containers: [],
    displayName: 'Graph Layer',
    type: '$library/Graph/Atoms/Graph',
    ligature: 'schema',
    inputs: {
      graphId: 'String'
    },
    outputs: {
      selected: 'String'
    }
  }
};