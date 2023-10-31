/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const NodeInspectorAdaptorNode = {
  adaptor: {
    type: '$library/Inspector/Atoms/NodeInspectorAdaptor',
    inputs: ['layerId', 'graph', 'selected'],
    outputs: ['data', 'info']
  }
};
