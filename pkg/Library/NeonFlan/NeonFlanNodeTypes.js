/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'NeonFlan';

export const NeonFlanNodeTypes = {
  UXSchemaNode: {
    // TODO: move types here?
    category,
    type: '$library/NeonFlan/Nodes/UXSchemaNode'
  },
  SiteNode: {
    category,
    type: '$library/NeonFlan/Nodes/SiteNode'
  },
  NodeTypesDocNode: {
    category,
    type: '$library/NeonFlan/Nodes/NodeTypesDocNode'
  }
};
