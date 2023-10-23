/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const NodeInspectorAdaptorNode = {
  adaptor: {
    type: '$library/Inspector/Atoms/NodeInspectorAdaptor',
    inputs: ['layerId', 'graph', 'selected'],
    outputs: ['data', 'info']
  }
};
