/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const server = `https://openai.iamthearchitect.workers.dev`;

export const OpenAIService = {
  async chat(layer, atom, data) {
    const response = await post(`${server}/chat`, objectToFormData(data));
    const result = await response.json();
    return result;
  },

  async edits(layer, atom, {prompt, image, size, n}) {
    const srcImage = await fetch(image?.url);
    if (srcImage) {
      const body = new FormData();
      //
      const imageBlob = await srcImage.blob();
      body.append('prompt', prompt);
      body.append('image', imageBlob);
      body.append('size', size??'256x256');
      body.append('n', n??'1');
      //
      const response = await post(`${server}/edits`, body);
      const result = await response.json();
      return result?.[0];
    }
  }
};

const post = (url, body) => fetch(url, {
  method: 'POST', 
  body
});

const objectToFormData = (obj) => {
  const body = new FormData();
  Object.entries(obj).forEach(([name, value]) => body.append(name, value));
  return body;
};
