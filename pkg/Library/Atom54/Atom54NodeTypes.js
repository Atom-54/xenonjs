/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Atom54';

export const Atom54NodeTypes = {
  UXSchemaNode: {
    // TODO: move types here?
    category,
    type: '$library/Atom54/Nodes/UXSchemaNode'
  },
  SiteNode: {
    category,
    type: '$library/Atom54/Nodes/SiteNode'
  },
  NodeTypesDocNode: {
    category,
    type: '$library/Atom54/Nodes/NodeTypesDocNode'
  },
  GraphFlanner: {
    category,
    types: {
      GraphFlanner$graph: 'String',
      GraphFlanner$query: 'String',
      GraphFlanner$label: 'String'
    },
    description: 'Choose the best suitable graph',
    type: '$library/Atom54/Nodes/GraphFlannerNode'
  }
};
