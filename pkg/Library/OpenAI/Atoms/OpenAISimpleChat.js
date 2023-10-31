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
  // const dirtyOn = isDirty('on');
  // if (on && dirtyOn) {
  state.result = null;
  // }
  //if (go && !state.result) {
    output({working: true, result: null});
    const result = /*state.result =*/ await this.updateResult(inputData, state);
    return {result, working: false};
  //}
  //if (dirtyOn) {
  //  return {working: on};
  //}
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
    model: 'gpt-3.5-turbo-16k',
    //model: 'gpt-4',
    max_tokens: 5*1024,
    temperature: 0.8,
    frequency_penalty: 0
};
  // const body = new FormData();
  // body.append('messages', JSON.stringify(messages));
  // body.append('model', 'gpt-4');
  //model: "gpt-3.5-turbo",
  //messages: [{"role": "user", "content": "Hello!"}],
  //frequency_penalty: 0.7,
  //temperature: 0.8,
  //max_tokens: 2048,
  const result = await state.chat(body);
  const message = result?.choices?.[0]?.message?.content;
  log(`got result:`, message);
  return message;
}
});
  
