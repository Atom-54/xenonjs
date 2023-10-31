/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const DesignTableNode = {
  grid: {
    type: '$library/Layout/Atoms/DesignGrid',
    inputs: ['items']
  },
  state: {
    // This is temporary test data:
    grid$items: [
      {
        "id": "id0",
        "content": "my first widget"
      },
      {
        "w": 2,
        "id": "id1",
        "content": "another longer widget!"
      },
      {
        "h": 2,
        "id": "id2",
        "content": "another taller widget!"
      }
    ]
  }
};
