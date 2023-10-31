/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const LobbyNode = {
  $meta: {
    id: 'LobbyNode',
    displayName: 'Lobby',
    category: 'Lobby'
  },
  lobby: {
    $kind: '$library/Lobby/Lobby',
    $inputs: [
      'group',
      {profile: 'user'},
      {returnStream: 'stream'}
    ]
  }
};