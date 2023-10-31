/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const AskPolymathNode = {
  AskPolymath: {
    type: '$library/Polymath/Atoms/AskPolymath',
    inputs: ['library', 'query', 'enabled', 'trigger'],
    outputs: ['result', 'completion', 'query', 'working']
  }
};