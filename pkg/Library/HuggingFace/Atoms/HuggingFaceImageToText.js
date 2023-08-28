export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.inference = (model, inputs) => service('HuggingFaceService', 'textInference', {model, inputs});
},
shouldUpdate({model, image}) {
  return model && image;
},
async update({model, image}, {inference}, {output}) {
  output({working: true});
  const result = await inference(model, image.url ?? image);
  const text = result?.[0]?.generated_text;
  return {
    text,
    working: false
  };
}
});
