export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 NeonFlan LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  async update({}, state, {service}) {
    const nodeTypes = await service('SystemService', 'GetNodeTypes');
    return {nodeTypes};
  }
});
  