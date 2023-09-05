/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const ClientNode = {
  $meta: {
    id: 'ClientNode',
    displayName: 'Client (for Lobby)',
    category: 'Lobby'
  },
  $stores: {
    group: {
      $type: 'String'
    },
    user: {
      $type: 'Profile'
    },
    stream: {
      $type: 'Stream'
    }
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