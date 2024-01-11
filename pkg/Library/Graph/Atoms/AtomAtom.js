export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  async update({atomType, atomCode}, state, {isDirty, service}) {
    if (isDirty('atomType') || isDirty('atomCode')) {
      await service('LayerService', 'CreateAtom', {atomType, atomCode});
    }
  },
  template: html`
  <slot name="Container"></slot>
  `
  });
    