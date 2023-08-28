export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  // TODO(sjmiles): shouldn't be hardcoded, um, obvs
  const server = `https://openai.iamthearchitect.workers.dev/`;
  const post = (url, body) => fetch(url, {method: 'POST', body: JSON.stringify(body)});
  state.ai = (context, prompt) => post(server, `${context ?? ''}${prompt}`);
},
shouldUpdate({prompt}) {
  return prompt;
},
async update({context, prompt, restart}, state, {output}) {
  let promptChanged = false;
  if (state.prompt !== prompt || state.context !== context) {
    log.groupCollapsed('caching prompt');
    log(prompt);
    state.prompt = prompt;
    state.context = context;
    log.groupEnd();
    promptChanged = true;
  }
  let completion;
  if (promptChanged && restart) {
    log.groupCollapsed(/*'promptChanged || */'restart', prompt);
    log('output temporary result');
    output({/*status: `a moment...`, *//*restart: false,*/ working: true});
    log('query ai');
    const response = await state.ai(context, prompt);
    const text = await response.text();
    completion = text.trim() || '(unintelligible)';
    log(`got result: "${completion}"`);
    log.groupEnd();
  }
  if (completion && completion != state.completion) {
    state.completion = completion;
    log.groupCollapsed('completion');
    log(completion);
    log.groupEnd();
    return {result: completion, markup: this.simpleFormatter(completion), working: false};
  }
},
simpleFormatter(text) {
  return `<div style="line-height: 140%; padding: 4px;">
  <p style="margin-top: 0;">${text?.split('\n').filter(i=>i).join('</p><p style="margin-bottom: 0;">')}</p>
</div>`;
}
});
  