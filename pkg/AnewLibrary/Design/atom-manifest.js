/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Design';

export const Design = {
  AtomTree: {
    category,
    displayName: 'Atom Tree',
    ligature: 'account_tree',
    type: '$anewLibrary/Design/Atoms/AtomTree.js',
    inputs: {
      selected: 'String'
    },
    outputs: {
      selected: 'String'
    }
  },
  DesignSelector: {
    category,
    displayName: 'Design Selector',
    type: '$anewLibrary/Design/Atoms/DesignSelector.js',
    ligature: 'done_outline'
  },
  DesignTarget: {
    category,
    displayName: 'Design Target',
    type: '$anewLibrary/Design/Atoms/DesignTarget.js',
    ligature: 'target'
  },
  NodeGraph: {
    category,
    displayName: 'Node Graph',
    type: '$anewLibrary/Design/Atoms/NodeGraph.js',
    ligature: 'schema'
  }
};