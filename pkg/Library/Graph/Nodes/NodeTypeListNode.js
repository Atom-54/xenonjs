/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const NodeTypeListNode = {
  search: {
    type: '$library/Graph/Atoms/QueryBar',
    inputs: ['query', 'icon', 'placeholder', 'reactive'],
    outputs: ['query'],
    container: 'typeList#search',
  },
  typeList: {
    type: '$library/Graph/Atoms/NodeTypeList',
    inputs: ['nodeTypes', 'graphs'],
    bindings: {search: 'search$query'},
    outputs: ['type']
  },
  actionExecutor: {
    type: '$library/UX/Atoms/UXActionExecutor',
    bindings: {event: 'typeList$event'}
  },
  nodeMeta: {
    type: '$library/Graph/Atoms/NodeMetaPanel',
    bindings: {'meta': 'typeList$hoveredMeta'},
    container: 'typeList#info'
  },
  state: {
    search$icon: 'search',
    search$placeholder: 'Search',
    search$reactive: true
  }
};
