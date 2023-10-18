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
    type: '$library/Graph/Nodes/GraphAgentNode',
    ligature: 'support_agent'
  },
  GraphListData: {
    category,
    description: 'Manage lists of graphs',
    type: '$library/Graph/Nodes/GraphListDataNode',
    ligature: 'lists'
  },
  NodeTypes: {
    category,
    description: 'Get information on installed Nodes',
    type: '$library/Graph/Nodes/NodeTypesNode',
    ligature: 'lists'
  },
  NodeTypeList: {
    category,
    description: 'Displays list of node types',
    type: '$library/Graph/Nodes/NodeTypeListNode',
    ligature: 'lists'
  },
  NodeGraph: {
    category,
    description: 'Displays graph nodes and connections',
    type: '$library/Graph/Nodes/NodeTreeNode',
    ligature: 'schema'
  },
  NodeTree: {
    category,
    description: 'Displays the rendering hierarchy of the graph',
    type: '$library/Graph/Nodes/NodeTreeNode',
    ligature: 'account_tree'
  },
  NodeStatus: {
    category,
    description: 'Displays the info about selected object',
    type: '$library/Graph/Nodes/NodeStatusNode',
    ligature: 'info'
  },
  Layer: {
    category,
    type: '$library/Graph/Nodes/LayerNode',
    types: {
      Layer$composer: 'ComposerId:String',
      Layer$designable: 'Boolean',
      Layer$graph: 'String'
    },
    ligature: 'layers'
  }
};