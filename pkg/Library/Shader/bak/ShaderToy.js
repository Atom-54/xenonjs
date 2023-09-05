/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
 ({
  async initialize({}, state, {service}) {
    state.canvas = await service({kind: 'MediaService', msg: 'allocateCanvas'});
    state.shader = await service({kind: 'MediaService', msg: 'allocateResource'});
  },
  async update({toy, input}, state, tools) {
    if ((input?.json !== state.input?.json) || toy?.Shader?.info?.id !== state.toyId) {
      state.toyId = toy?.Shader?.info?.id;
      state.input = input;
      return this.updateInput({toy, input}, state, tools);
    }
  },
  async updateInput({toy, input}, state, {service}) {
    if (input?.canvas && toy?.Shader?.info?.id) {
      state.output = {
        canvas: state.canvas,
        version: Math.random()
      };
      const {shader, output} = state;
      await this.shaderize(shader, toy, input, output, service);
      return {output};
    }
  },
  async shaderize(shaderId, toy, input, output, service) {
    return service({
      kind: 'ThreejsService',
      msg: 'shaderize',
      data: {
        shaderId,
        toy,
        inImageRef: input,
        outImageRef: output
      }
    });
  },
  render({input}, {output}) {
    return {
      output
    };
  },
  template: html`
  <style>
    :host {
      background-color: black;
      color: #eee;
      overflow: hidden;
      width: 240px;
      height: 300px;
      padding: 8px;
      border-radius: 8px;
    }
  </style>
  <image-resource center flex image="{{output}}"></image-resource>
  `
  });
