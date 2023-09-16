/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const GraphListDataNode = {
  // graphAgent: {
  //   type: '$library/Graph/Atoms/GraphAgent',
  //   inputs: ['user', 'graph', 'graphs', 'publishedGraphsUrl', 'publicGraphs', 'selectedId', 'readonly'],
  //   outputs: ['graph', 'graphs', 'publicGraphs', 'selectedId'],
  //   bindings: {
  //     event: 'actionExecutor$event',
  //     readonly: 'graphData$readonly',
  //   }
  // },
  graphData: {
    type: '$library/Graph/Atoms/GraphListData',
    //readonly, graph, graphs, publicGraphs, showMode, search
    inputs: ['user', 'graph', 'graphs', 'publicGraphs', 'selectedId', 'readonly', 'showMode'],
    outputs: ['graph', 'graphs', 'publicGraphs', 'selectedId', 'graphItems'],
  },
  // actionExecutor: {
  //   type: '$library/UX/Atoms/UXActionExecutor',
  //   bindings: {event: ['graphData$event']},
  //   inputs: ['readonly']
  // },
  state: {
    // graphAgent$graphs: [],
    graphData$showMode: 'private'
  }
};
