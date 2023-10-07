export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  const server = `https://openai.iamthearchitect.workers.dev`;
  const post = (url, body) => fetch(url, {method: 'POST', body: JSON.stringify(body)});
  // prompt: a text description of the desired image(s). The maximum length is 1000 characters.
  // [size]: Defaults to 1024x1024, must be one of 256x256, 512x512, or 1024x1024.
  // [n]: number of images to generate
  state.ai = (prompt, options) => post(`${server}/image`, {
    prompt,
    response_format: 'b64_json', // 'url'
    size: '256x256', // '512x512', '1024x1024'
    ...(options??0),
    n: 1
  });
},
shouldUpdate({enabled, prompt}) {
  return enabled && prompt;
},
async update({prompt, options}, state, {output, isDirty}) {
  // if (!isDirty('prompt') && !isDirty('restart') || prompt.startsWith('a moment')) {
  //   return {image: null};
  // }
  log('starting:', prompt);
  state.prompt = prompt;
  if (isDirty('restart')) {
    // log('output temporary result');
    output({
      image: null,
      working: true
    });
    // restart: false, 
    // result: `a moment...`
  
    log('query ai', prompt);
    const response = await state.ai(prompt, options);
    const info = await response.json();
    log('got response', info);
    const top = info?.data?.[0];
    const url = top?.b64_json ? `data:image/png;base64,${top.b64_json}` : top?.url;
    return {
      image: {url},
      working: false
    };
  }
}
});
