export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  state.chat = body => service('OpenAIService', 'chat', body);
},
shouldUpdate({user}, state, {isDirty}) {
  return Boolean(user) && isDirty('go');
},
async update({go, ...inputData}, state, {isDirty, output}) {
  state.result = null;
  output({working: true, result: null});
  const result = /*state.result =*/ await this.updateResult(inputData, state);
  return {result, working: false};
},
async updateResult({system, assistant, user}, state) {
  const messages = [];
  const add = (role, content) => content && messages.push({role, content});
  add('system', system);
  add('assistant', assistant);
  add('user', user);
  log('Prompting ai ...', messages);
  const body = {
    messages: JSON.stringify(messages),
    //model: 'gpt-4',
    model: 'gpt-3.5-turbo-16k',
    max_tokens: 5*1024,
    temperature: 0.8,
    frequency_penalty: 0
};
  const result = await state.chat(body);
  const message = result?.choices?.[0]?.message?.content;
  log(`got result:`, message);
  return message;
}
});
  
