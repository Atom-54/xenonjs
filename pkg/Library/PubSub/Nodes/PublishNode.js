/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PublishNode = {
  pubsub: {
    type: '$library/PubSub/Atoms/Publish',
    inputs: ['path', 'publishValue', 'auth']
  }
};
