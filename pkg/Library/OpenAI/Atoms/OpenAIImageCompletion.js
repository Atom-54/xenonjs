export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({image, prompt, enabled}) {
  return image && prompt && enabled;
},

async update({prompt, image}, state, {service, output, isDirty}) {
  if (isDirty('restart')) {
    state.prompt = prompt;
    output({working: true});
    const result = await service('OpenAIService', 'edits', {prompt, image});
    return {
      result,
      working: false
    };
  }
}

});
