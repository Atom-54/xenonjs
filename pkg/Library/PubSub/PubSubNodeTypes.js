/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'PubSub';

export const PubSubNodeTypes = {
  PubSub: {
    category,
    description: 'Simple Publish/Subscribe interface',
    type: '$library/PubSub/Nodes/PubSubNode'
  },
  ChatMarkup: {
    category,
    description: 'Simple markup for rendering Chat messages',
    type: '$library/PubSub/Nodes/ChatMarkupNode'
  }
};