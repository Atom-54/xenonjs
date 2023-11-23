/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PubSubNode = {
  pubsub: {
    type: '$library/PubSub/Atoms/PubSub',
    inputs: ['path', 'publishValue', 'auth'],
    outputs: ['subscribedValue']
  }
};
