export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  state.inference = (model, inputs, parameters) => service('HuggingFaceService', 'imageInference', {model, inputs, parameters});
},
shouldUpdate({imageToImageModel, image, active}) {
  return imageToImageModel && image && active;
},
async update({imageToImageModel, image, prompt}, {inference}, {output}) {
  output({working: true});
  const outputImage = await inference(imageToImageModel, image.url, {prompt});
  return {outputImage, working: false};
}
});
  