export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  async update({query}, state, {service}) {
    if (!state.nodeTypes?.length) {
      state.nodeTypes = await service('SystemService', 'GetNodeTypes');
    }
    return {
      nodeTypes: this.filter(state.nodeTypes, query)
    }
  },
  filter(nodeTypes, query) {
    if (!query) {
      return nodeTypes;
    }

    query = query?.toLowerCase();
    const matchQuery = (name) => name?.toLowerCase().includes(query);
    const result = {};
    entries(nodeTypes).forEach(([name, {category, description}]) => {
      if (matchQuery(name) || matchQuery(category) || matchQuery(description)) {
        result[name] = nodeTypes[name];
      }
    });
    return result;
  }
});
