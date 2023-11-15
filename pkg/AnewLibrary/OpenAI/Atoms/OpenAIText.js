export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  // TODO(sjmiles): shouldn't be hardcoded, um, obvs
  const server = `https://openai.iamthearchitect.workers.dev/`;
  const post = (url, body) => fetch(url, {method: 'POST', body: JSON.stringify(body)});
  state.ai = (context, prompt) => post(server, `${context ?? ''}${prompt}`);
},
shouldUpdate({context, prompt, enabled}) {
  return context && prompt && enabled;
},
async update({context, prompt}, state, {output, isDirty}) {
  let completion;
  if (isDirty('restart')) {
    log('working');
    output({working: true});
    if (typeof prompt === 'object') {
      prompt = JSON.stringify(prompt);
      log.debug(prompt);
    }
    const response = await state.ai(context, prompt);
    const text = await response.text();
    completion = text.trim() || '(unintelligible)';
  }
  if (completion && completion != state.completion) {
    state.completion = completion;
    log(completion);
    return {result: completion, markup: this.simpleFormatter(completion), working: false};
  }
},
simpleFormatter(text) {
  return `<div style="line-height: 140%; padding: 4px;">
  <p style="margin-top: 0;">${text?.split('\n').filter(i=>i).join('</p><p style="margin-bottom: 0;">')}</p>
</div>`;
}
});
