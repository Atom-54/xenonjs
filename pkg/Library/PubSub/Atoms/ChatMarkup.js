export const atom = (log) => ({
  /**
   * @license
   * Copyright 2023 NeonFlan LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  shouldUpdate({messages}) {
    return messages;
  },
  async update({messages}, state, {isDirty}) {
    return {
      markup: this.composeMarkup(messages)
    };
  },
  composeMarkup(messages) {
    const bubblify = (color, name) => `<span style="display: inline-block; font-weight: bold; font-size: 0.8em; padding: 0px 7px 1px; margin-right: 2px; border-radius: 8px; color: white; background-color: ${
      color};">${name}</span>`;
    const markup = messages.map(({role, name, msg}) => {
      if (role === 'assistant') {
        return `${bubblify('green', name)}<p>${msg}</p>`
      } else {
        return `${bubblify('blue', name)}<p>${msg}</p>`;
      }
    }).join('');
    return markup;
  }
  });
  