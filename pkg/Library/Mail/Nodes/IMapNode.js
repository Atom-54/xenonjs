/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const IMapNode = {
  IMap: {
    type: '$library/Mail/Atoms/IMap',
    inputs: ['host', 'user', 'password', 'config'],
    outputs: ['config', 'messages', 'columns']
  },
  state: {
    IMap$columns: [
      {
        "name": "from"
      },
      {
        "name": "subject"
      },
      {
        "name": "to"
      },
      {
        "name": "date"
      }
    ]
  }
};