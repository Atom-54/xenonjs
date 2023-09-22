/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const AskPolymathNode = {
  AskPolymath: {
    type: '$library/Polymath/Atoms/AskPolymath',
    inputs: ['library', 'query'],
    outputs: ['result', 'completion', 'query']
  }
};