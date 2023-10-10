/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'PubSub';

export const PubSubNodeTypes = {
  Publish: {
    category,
    description: 'Publish data',
    type: '$library/PubSub/Nodes/PublishNode'
  },
  PubSub: {
    category,
    description: 'Publish data and subscribe to changes',
    type: '$library/PubSub/Nodes/PubSubNode'
  },
  ChatMarkup: {
    category,
    description: 'Simple markup for rendering Chat messages',
    type: '$library/PubSub/Nodes/ChatMarkupNode'
  },
  SendButton: {
    category,
    description: 'Button to manage Send actions',
    type: '$library/PubSub/Nodes/SendButtonNode'
  }
};