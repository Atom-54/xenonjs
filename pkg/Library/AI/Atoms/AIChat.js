export const atom = (log) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({messages}) {
  return messages;
},
async update({messages, message, result}, state, {isDirty}) {
  let output = null;
  if (isDirty('result') && result) {
    const msg = result.choices?.[0].message;
    if (msg) {
      messages.push(msg);
    }
    output = {messages};
  }
  if (isDirty('message') && message) {
    message = message.transcript ?? message;
    messages.push({
      role: 'user',
      content: message
    });
    output = {messages};
  }
  if (output) {
    output.markup = this.composeMarkup(messages);
  }
  return output;
},
composeMarkup(messages) {
  const bubblify = (color, name) => `<span style="display: inline-block; font-weight: bold; font-size: 0.8em; padding: 0px 7px 1px; margin-right: 2px; border-radius: 8px; color: white; background-color: ${
    color};">${name}</span>`;
  const markup = messages.map(({role, content}) => {
    if (role === 'assistant') {
      return `${bubblify('green', 'Assistant')}<p>${content}</p>`
    }
    if (role === 'user') {
      return `${bubblify('blue', 'User')}<p>${content}</p>`
    }
  }).join('');
  return markup;
}
});
