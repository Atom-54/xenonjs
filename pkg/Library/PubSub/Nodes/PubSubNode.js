/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PubSubNode = {
  pubsub: {
    type: '$library/PubSub/Atoms/PubSub',
    inputs: ['path', 'publishValue'],
    outputs: ['subscribedValue']
  }
};
