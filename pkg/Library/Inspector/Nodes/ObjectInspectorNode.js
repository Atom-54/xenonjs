/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const ObjectInspectorNode = {
  inspector: {
    type: '$library/Inspector/Atoms/ObjectInspector',
    inputs: ['data', 'customInspectors'],
    outputs: ['data']
  }
  // actionExecutor: {
  //   type: '$library/UX/Atoms/UXActionExecutor',
  //   bindings: {event: 'inspector$event'}
  // }
};
