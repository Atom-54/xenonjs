export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.inference = (model, inputs) => service('HuggingFaceService', 'imageInference', {model, inputs});
},
shouldUpdate({textToImageModel, prompt}) {
  return textToImageModel && prompt;
},
async update({textToImageModel, prompt}, {inference}, {output}) {
  output({working: true});
  const image = await inference(textToImageModel, prompt);
  return {image, working: false};
}
});
  