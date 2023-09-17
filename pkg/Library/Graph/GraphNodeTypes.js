/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Graph';

export const GraphNodeTypes = {
  GraphAgent: {
    category,
    description: 'Synchronize lists of graphs with durable Storage',
    type: '$library/Graph/Nodes/GraphAgentNode'
  },
  GraphListData: {
    category,
    description: 'Manage lists of graphs',
    type: '$library/Graph/Nodes/GraphListDataNode'
  },
  NodeTypeList: {
    category,
    description: 'Displays list of node types',
    type: '$library/Graph/Nodes/NodeTypeListNode'
  },
  NodeTree: {
    category,
    description: 'Displays the rendering hierarchy of the graph',
    type: '$library/Graph/Nodes/NodeTreeNode'
  },
  NodeStatus: {
    category,
    description: 'Displays the info about selected object',
    type: '$library/Graph/Nodes/NodeStatusNode'
  },
  Layer: {
    category,
    type: '$library/Graph/Nodes/LayerNode',
    types: {
      Layer$designable: Boolean,
      Layer$graph: 'String'
    }
  }
};