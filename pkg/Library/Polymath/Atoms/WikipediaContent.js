export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  shouldUpdate(inputs, state, {isDirty}) {
    return isDirty('trigger');    
  },

  async update({query}, state, {service}) {
    // if (!isDirty('trigger')) {
    //   log.warn('query came again!')
    //   return;
    // }
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
  