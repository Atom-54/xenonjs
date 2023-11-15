export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  state.chat = body => service('OpenAIService', 'chat', body);
},
shouldUpdate({messages}) {
  return messages;
},
async update({messages, restart}, state, {isDirty}) {
  if ((isDirty('messages') && messages?.length) || restart) {
    const newest = messages[messages.length-1];
    if (newest.role === 'user') {
      log('querying ai', messages);
      //
      const body = new FormData();
      body.append('messages', JSON.stringify(messages));
      const response = await state.chat(body);
      //
      const result = await response.json();
      log(`got result:`, result);
      return {result};
    }
  }
}
});
  
