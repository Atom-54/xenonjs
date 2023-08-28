/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
({
  initialize(inputs, state, {service}) {
    const post = (url, body) => fetch(url, {method: 'POST', body: JSON.stringify(body)});
    state.llm = (context, prompt) => post(server, `${context}${prompt}`);
  },
  shouldUpdate({prompt}) {
    return prompt;
  },
  async update({context, prompt, result}, state, {output}) {
    if (!state.prompt && result) {
      log('prompt && result but no state prompt, caching prompt:', prompt);
      state.prompt = prompt;
    }
    if (state.prompt !== prompt || !result) {
      log('prompt && !result, caching prompt:', prompt);
      state.prompt = prompt;
      log('output temporary result');
      output({result: `a moment...`});
      log('query gpt3');
      const responses = await state.llm(context, prompt);
      //
      const chunks = (responses ?? '').split('\n\n').filter(i=>i);
      log('got responses', chunks);
      const response = chunks?.[0] ?? '{}';
      try {
        const json = response.slice(response.indexOf('{'));
        log('attempting to parse json', json);
        const nodes = JSON.parse(json);
        const graph = {
          $meta: {
            "name": `fatal-atmosphere-${Math.floor((Math.random()+9)*100)}`,
            "id": "4150-8373-3944"
          },
          nodes
        };
        log('composed graph', graph);
        return {result: JSON.stringify(graph, null, '  ')};
      } catch(x) {
        log(`Error ${String(x)}`);
        return {result: `${prompt}\n\nFailed, sorry (console knows more).`};
      }
    }
  }
  });
  