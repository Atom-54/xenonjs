export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// use iamthearchitect REST interface to generate 
// TextEmbeddings for input text
initialize(inputs, state) {
  const server = 'https://openai.iamthearchitect.workers.dev/embed/';
  const post = (url, body) => fetch(url, {method: 'POST', body: JSON.stringify(body)});
  state.embed = async (text) => {
    const response = await (await post(server, text)).json();
    return response?.data?.[0]?.embedding;
  };
},
shouldUpdate({/*apiKey,*/ text}) {
  return /*apiKey &&*/ text;
},
async update({text}, state) {
  const dirty = (text && text !== state.text);
  state.text === text;
  if (dirty) {
    log(`working on [${text}]`);
    const result = await state.embed(text);
    log(`got vector`);
    return {vector: result};
  }
}
});
