export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize({}, state, {service}) {
  state.canvas = await service({kind: 'MediaService', msg: 'allocateCanvas'});
},
async update(inputs, state, {service}) {
  const {image, audio, defaultShaders, defaultShader} = inputs;
  // use explicit shader or one of the defaults
  const shader = inputs.shader || defaultShaders?.[defaultShader];
  if (shader !== state.shader) {
    state.shader = shader;
    state.shaderId = await this.updateShaderId(state.shaderId, shader, service);
  }
  if (state.shaderId && image?.canvas || audio) {
    state.output = await this.updateOutputCanvas(inputs, state, {service});
    return {outputImage: state.output};
  }
},
async updateShaderId(shaderId, shader, service) {
  return shader && await service({
    kind: 'ShaderService',
    msg: 'makeShader',
    data: {shader, shaderId}
  });
},
async updateOutputCanvas(inputs, state, {service}) {
  const output = {
    canvas: state.canvas,
    version: Math.random()
  };
  await this.shaderize(state.shaderId, inputs, output, service);
  return output;
},
async shaderize(shaderId, {shader, image, image2, image3, image4, audio}, output, service) {
  return service({
    kind: 'ShaderService',
    msg: 'runFragment',
    data: {
      shader,
      shaderId,
      inImageRefs: [image, image2, image3, image4],
      inAudioRef: audio,
      outImageRef: output
    }
  });
}
});
