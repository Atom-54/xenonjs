/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Communication';

export const PubSubNodeTypes = {
  Publish: {
    category,
    description: 'Publish data',
    type: '$library/PubSub/Nodes/PublishNode',
    ligature: 'publish'
  },
  PubSub: {
    category,
    description: 'Publish data and subscribe to changes',
    type: '$library/PubSub/Nodes/PubSubNode',
    ligature: 'published_with_changes'
  },
  ChatMarkup: {
    category,
    description: 'Simple markup for rendering Chat messages',
    type: '$library/PubSub/Nodes/ChatMarkupNode',
    ligature: 'chat'
  },
  SendButton: {
    category,
    description: 'Button to manage Send actions',
    type: '$library/PubSub/Nodes/SendButtonNode',
    ligature: 'outbox_alt'
  }
};