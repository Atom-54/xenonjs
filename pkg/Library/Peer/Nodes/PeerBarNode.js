/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PeerBarNode = {
  PeerBar: {
    type: '$library/Peer/Atoms/PeerBar',
    inputs: ['staticPeers'],
    outputs: ['peers'],
    bindings: {
      peers: 'PeerCollector$peers'
    }
  },
  PeerCollector: {
    type: '$library/Peer/Atoms/PeerCollector',
    inputs: ['peer', 'peers']
  }
};
