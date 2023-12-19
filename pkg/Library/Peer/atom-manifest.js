/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Peer';

export const Peer = {
  Publish: {
    categories: [category],
    ligature: 'publish',
    displayName: 'Message Publisher',
    description: 'Publish messages on a channel',
    type: '$library/Peer/Atoms/Publish',
    inputs: {
      path: 'String',
      publishVaue: 'Pojo',
      auth: 'Auth'
    }
  },
  Subscribe: {
    categories: [category],
    ligature: 'published_with_changes',
    displayName: 'Message Subscriber (and publisher)',
    description: 'Publish and subscribe to messages on a channel',
    type: '$library/Peer/Atoms/PubSub',
    inputs: {
      path: 'String',
      publishVaue: 'Pojo',
      auth: 'Auth'
    },
    outputs: {
      subscribedValue: 'Pojo'
    }
  }
};
