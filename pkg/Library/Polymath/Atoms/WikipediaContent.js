export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 NeonFlan LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  async update({query}, state, {service, isDirty}) {
    if (!isDirty('query')) {
      log.warn('query came again!')
      return;
    }
    if (query) {
      const {title, html} = await service('PolymathService', 'QueryWikipedia', {query});
      return {title, markup: html};
    } else {
      return {
        title: null,
        markup: null
      }
    }
  }
});
  