/**
 * @license
 * Copyright (c) 2022 Google LLC. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
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