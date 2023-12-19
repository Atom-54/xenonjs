export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.inference = (model, inputs) => service('HuggingFaceService', 'textInference', {model, inputs});
},
shouldUpdate({model, customModel, image}) {
  return (customModel || model) && image;
},
async update({model, customModel, image}, {inference}, {output}) {
  output({working: true});
  const result = await inference(customModel || model, image.url ?? image);
  const text = result?.[0]?.generated_text;
  return {
    result,
    text,
    working: false
  };
}
});
