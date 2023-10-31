export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({topic, personas, restart}) {
  return restart && topic && keys(personas).length;
},
async update(inputs, state, {output}) {
  const watch = ['rounds', 'topic', 'personas', 'result', 'polymathResult'];
  const dirtySet = {};
  watch.forEach(p => {
    if (!deepEqual(inputs[p], state[p])) {
      state[p] = inputs[p];
      dirtySet[p] = true;
    }
  });
  output({restart: false});
  return this._update({...inputs, dirtySet}, state);
},
async _update({dirtySet, personas, rounds, result, polymathResult, topic}, state) {
  const output = {};
  if (polymathResult && dirtySet.polymathResult) {
    result = polymathResult.completion;
    dirtySet.result = true;
  }
  // consume a result
  if (dirtySet.result) {
    if (result.includes('a moment')) {
      // ignore time waster
      log('got result: ignoring umm...');
    } else {
      state.waiting = false;
      log('got result: no more waiting');
      const cleaned = result.replace(/[\s\W]*/, '').replace(/[\s\W]*$/, '') + '.';
      const truncated = cleaned.split('\n').shift();
      const transcript = `${state.transcript||''} ${truncated}\n`;
      log('transcript:\n', transcript);
      state.transcript = transcript;
      output.transcript = transcript;
      output.markup = this.markupTranscript(transcript, personas);
    }
  }
  // do nothing else if waiting, or if there are no rounds of discussion
  if (!state.waiting) {
    // get the persona names
    const names = keys(personas);
    // force type
    rounds = Number(rounds) || 0;
    // dependencies changed?
    if (dirtySet.rounds || dirtySet.topic || dirtySet.personas) {
      state.round = 0;
      state.nameOffset = Math.floor(Math.random()*keys.length);
      const nameList = `${['Moderator', ...names].slice(0, -1).join(', ')} and ${names.slice(-1)}`;
      state.transcript = 
`This is a conversation between ${nameList}.

${this.introText('Moderator')} ${typeof topic === 'string' ? topic : ''}\n`;
      log(`reset for ${state.rounds} round(s)`);
    }
    // have rounds to go?
    if (state.round < state.rounds) {
      // do this round
      state.round++;
      log('starting round', state.round);
      // don't continue until we get a result
      state.waiting = true;
      // get the persona name for this round
      const name = names[(state.round + state.nameOffset) % names.length];
      log(`next up is [${name}]`);
      // grab the persona's context
      let context = personas[name];
      log('context is:\n', context);
      // include the conversation in the prompt
      state.transcript += `\n${this.introText(name)}`;
      const prompt = state.transcript;
      // polymath?
      const isPolymath = name?.toLowerCase().includes('polymath'); 
      const polymathServer = isPolymath ? context : '';
      if (isPolymath) {
        context = '';
      }
      const promptKey = isPolymath ? 'polymathQuery' : 'openAIPrompt';
      const otherPromptKey  = isPolymath ? 'openAIPrompt' : 'polymathQuery';
      //const resultCacheKey = isPolymath ? 'lastPolymathResult' : 'lastResult';
      //state[resultCacheKey] = null;
      //log('prompt is:\n', prompt);
      assign(output, {context, [promptKey]: prompt, [otherPromptKey]: null, polymathServer});
    }
    log('output', output);
    return output;
  }
},
introText(name) {
  return `[${name}]`;
},
markupTranscript(text, personas) {
  const chart = this.buildColorChart({...personas, Moderator: true});
  const bubblify = name => {
    return `<span style="display: inline-block; font-weight: bold; font-size: 0.8em; padding: 0px 7px 1px; margin-right: 2px; border-radius: 8px; color: white; background-color: ${
      chart[name]};">${name}</span>`;
  };
  return text
    .replace(/\[(.*?)\]/g, (match, p0, p1) => bubblify(p0))
    .replace(/\n/g, '<br>')
    ;
},
buildColorChart(personas) {
  const color = ['#5d96be', '#be855d', '#855dbe', '#b65dbe', '#96be5d', '#5d66be'];
  // make an object with keys from `personas` matched with colors from list above (this is the 'ColorChart', c.f. "Call Me")
  return keys(personas).reduce((chart, p, i) => {
    chart[p] = color[i%6];
    return chart;
  }, create(null));
}
});
