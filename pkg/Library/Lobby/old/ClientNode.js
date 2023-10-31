/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const ClientNode = {
  $meta: {
    id: 'ClientNode',
    displayName: 'Client (for Lobby)',
    category: 'Lobby'
  },
  lobby: {
    $kind: '$library/Lobby/Client',
    $inputs: [
      'group',
      {profile: 'user'},
      'stream'
    ]
  }
};