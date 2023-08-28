export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.inference = (model, inputs) => service('HuggingFaceService', 'textInference', {model, inputs});
},
shouldUpdate({model, prompt}) {
  return model && prompt;
},
async update({model, prompt}, {inference}, {output}) {
  output({working: true});
  const result = await inference(model, prompt);
  return {result, working: false};
}
});
