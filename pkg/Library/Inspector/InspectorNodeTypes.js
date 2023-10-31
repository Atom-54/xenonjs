/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'UX';

export const InspectorNodeTypes = {
  ObjectInspector: {
    category,
    description: 'General purpose inspector and editor of JSON data',
    type: '$library/Inspector/Nodes/ObjectInspectorNode',
    ligature: 'frame_inspect'
  },
  OpenStyleInspector: {
    category,
    description: 'Custom inspector of visual styling and layout',
    type: '$library/Inspector/Nodes/OpenStyleInspectorNode',
    ligature: 'frame_inspect'
  },
  NodeInspectorAdaptor: {
    category: 'Graph',
    description: 'Adapts graph nodes data into a format compatible with the ObjectInspector',
    type: '$library/Inspector/Nodes/NodeInspectorAdaptorNode',
    ligature: 'info'
  },
  ToysInspector: {
    category,
    description: 'Toy selector',
    types: {
      inspect$key: 'String'
    },
    type: '$library/Inspector/Nodes/ToysInspectorNode',
    ligature: 'frame_inspect'
  }
};