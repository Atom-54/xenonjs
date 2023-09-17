/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const GraphListNode = {
  graphToolbar: {
    type: '$library/UX/Atoms/UXToolbar',
    inputs: ['actions'],
    bindings: {event: 'graphAgent$event'},
    container: 'graphList#toolbar'
  },
  graphRequest: {
    type: '$library/Graph/Atoms/QueryBar',
    inputs: ['query', 'placeholder', 'icon', 'reactive'],
    outputs: ['query'],
    container: 'graphToolbar#input'
  },
  graphList: {
    type: '$library/Graph/Atoms/GraphList',
    inputs: ['readonly', 'user', 'showMode'],
    bindings: {
      graph: 'graphAgent$graph',
      graphs: 'graphAgent$graphs',
      publicGraphs: 'graphAgent$publicGraphs',
      event: 'graphAgent$event',
      search: 'graphRequest$query'
    }
  },
  graphAgent: {
    type: '$library/Graph/Atoms/GraphAgent',
    inputs: ['readonly', 'user', 'publishedGraphsUrl', 'graphs', 'publicGraphs', 'graph', 'selectedMeta'],
    outputs: ['graphs', 'publicGraphs', 'graph', 'selectedMeta'],
    bindings: {
      event: 'actionExecutor$event',
      readonly: 'graphList$readonly',
    }
  },
  actionExecutor: {
    type: '$library/UX/Atoms/UXActionExecutor',
    bindings: {event: ['graphList$event', 'graphToolbar$event']},
    inputs: ['readonly']
  },
  state: {
    graphAgent$graphs: [],
    graphList$showMode: 'private',
    graphToolbar$actions: [{
      name: 'Show Public',
      ligature: 'public',
      value: 'public',
      action: 'set',
      stateKey: 'GraphList$graphList$showMode'
    }, {
      name: 'Show Private',
      ligature: 'shield_lock',
      value: 'private',
      action: 'set',
      stateKey: 'GraphList$graphList$showMode'
    }, {
      name: 'spanner', 
      flex: 1
    }, {
      name: 'Add Graph',
      ligature: 'add'
    }, {
      name: 'spanner', 
      flex: 1
    }, {
      name: 'Refresh Public Graphs',
      ligature: 'refresh'
    }, {
      name: 'query',
      slot: 'input',
      style: 'justify-content: end',
      flex: 2
    }],
    graphRequest$query: '',
    graphRequest$reactive: true,
    graphRequest$icon: 'search',
    graphRequest$placeholder: 'Search Graphs'
  }
};
