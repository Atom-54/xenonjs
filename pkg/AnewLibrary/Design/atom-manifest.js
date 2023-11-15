/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const categories = ['Design'];

export const Design = {
  AtomTree: {
    categories,
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
    categories,
    displayName: 'Design Selector',
    type: '$anewLibrary/Design/Atoms/DesignSelector.js',
    ligature: 'done_outline'
  },
  DesignTarget: {
    categories,
    displayName: 'Design Target',
    type: '$anewLibrary/Design/Atoms/DesignTarget.js',
    ligature: 'target'
  },
  NodeGraph: {
    categories,
    displayName: 'Node Graph',
    type: '$anewLibrary/Design/Atoms/NodeGraph.js',
    ligature: 'schema'
  }
};