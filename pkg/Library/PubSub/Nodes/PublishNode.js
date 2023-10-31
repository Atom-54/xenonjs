/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PublishNode = {
  pubsub: {
    type: '$library/PubSub/Atoms/Publish',
    inputs: ['path', 'publishValue', 'auth']
  }
};
