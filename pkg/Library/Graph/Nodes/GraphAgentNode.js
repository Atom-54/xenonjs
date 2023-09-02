/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const GraphAgentNode = {
  graphAgent: {
    type: '$library/Graph/Atoms/GraphAgent',
    inputs: ['user', 'graph', 'graphs', 'publishedGraphsUrl', 'publicGraphs', 'selectedId', 'readonly'],
    outputs: ['graph', 'graphs', 'publicGraphs', 'selectedId']
  },
  state: {
    graphAgent$graphs: [],
    graphAgent$publishedGraphsUrl: 'https://xenon-js-default-rtdb.firebaseio.com/0_3',
  }
};
