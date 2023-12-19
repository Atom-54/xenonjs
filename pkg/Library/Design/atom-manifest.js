/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Designer';

export const Design = {
  AtomTree: {
    categories: [category],
    displayName: 'Atom Tree',
    ligature: 'account_tree',
    type: '$library/Design/Atoms/AtomTree.js',
    inputs: {
      selected: 'String'
    },
    outputs: {
      selected: 'String'
    }
  },
  DesignSelector: {
    categories: [category],
    displayName: 'Design Selector',
    type: '$library/Design/Atoms/DesignSelector.js',
    ligature: 'done_outline'
  },
  DesignTarget: {
    categories: [category],
    displayName: 'Design Target',
    type: '$library/Design/Atoms/DesignTarget.js',
    ligature: 'target'
  },
  AtomGraph: {
    categories: [category],
    displayName: 'Node Graph',
    type: '$library/Design/Atoms/AtomGraph.js',
    ligature: 'schema'
  }
};