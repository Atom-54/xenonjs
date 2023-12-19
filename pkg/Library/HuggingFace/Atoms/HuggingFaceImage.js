export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.inference = (model, inputs) => service('HuggingFaceService', 'imageInference', {model, inputs});
},
shouldUpdate({textToImageModel, prompt, trigger}) {
  return textToImageModel && prompt && trigger;
},
async update({textToImageModel, prompt}, state, {output, isDirty}) {
  if (isDirty('trigger')) {
    output({working: true});
    if (isDirty('prompt')) {
      state.prompt = prompt;
    } else {
      state.prompt = `${state.prompt} `;
    }
    const image = await state.inference(textToImageModel, state.prompt);
    return {image, working: false};
  }
}
});
