export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  state.chat = body => service('OpenAIService', 'chat', body);
},
shouldUpdate({user, auto}, state, {isDirty}) {
  return user && (auto || isDirty('go'));
},
async update({go, auto, ...inputData}, state, {output}) {
  state.result = null;
  output({working: true, result: null});
  const result = /*state.result =*/ await this.updateResult(inputData, state);
  return {result, working: false};
},
async updateResult({system, assistant, user, model, kTokens, temperature}, state) {
  const messages = [];
  const add = (role, content) => content && messages.push({role, content});
  add('system', system);
  add('assistant', assistant);
  add('user', user);
  log('Prompting ai ...', messages);
  const body = {
    messages: JSON.stringify(messages),
    model: model ?? 'gpt-3.5-turbo-16k',
    //model: 'gpt-4',
    max_tokens: (kTokens || 7)*1024,
    temperature: temperature || 0.3,
    frequency_penalty: 0
};
  const result = await state.chat(body);
  const message = result?.choices?.[0]?.message?.content;
  log(`got result:`, message);
  return message;
}
});
  
