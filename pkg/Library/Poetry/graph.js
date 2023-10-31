/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// three different ways

// const AIClockNode = {
//   clock: {
//     type: '$library/AI/Atoms/AIClock'
//   },
//   ai: {
//     type: '$library/OpenAI/Atoms/OpenAIText',
//     bindings: {
//       prompt: 'clock$prompt'
//     }
//   }
// };

// import * as Nodes from '../Framework/Nodes.js';
// Nodes.registerNamedNodeMetas({$library$AI$Nodes$AIClockNode: AIClockNode});

// graph
export const graph = {
  nodes: {
    AIClock: {
      //type: AIClockNode // use inline
      //type: '$library/AI/Nodes/AIClockNode' // use local registry
      type: '$library/AI/Nodes/AIClockNode' // use dynamic registry
    }
  }
};