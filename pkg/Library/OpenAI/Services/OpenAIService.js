/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const server = `https://openai.iamthearchitect.workers.dev`;

export const OpenAIService = {
  async chat(host, data) {
    const response = await post(`${server}/chat`, objectToFormData(data));
    const result = await response.json();
    return result;
  },
  async edits(host, {prompt, image, size, n}) {
    const srcImage = await fetch(image?.url);
    if (srcImage) {
      const imageBlob = await srcImage.blob();
      //
      const body = new FormData();
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

export const chatCompletion = async (messages, max_tokens) => {
  const data = {
    messages: JSON.stringify(messages)
  };
  if (max_tokens) {
    data.max_tokens = max_tokens;
  }
  const response = await post(`${server}/chat`, objectToFormData(data));
  const result = await response.json();
  return result;
};

export const textEmbed = async (text) => {
  const response = await post(`${server}/embed`, JSON.stringify(text));
  const result = await response.json();
  return result?.data?.[0]?.embedding;
};  

const post = (url, body) => fetch(url, {method: 'POST', body});

const objectToFormData = obj => {
  const body = new FormData();
  Object.entries(obj).forEach(([name, value]) => body.append(name, value));
  return body;
};
