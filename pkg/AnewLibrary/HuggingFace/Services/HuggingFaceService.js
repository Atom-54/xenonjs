/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const server = 'https://openai.iamthearchitect.workers.dev';
const post = (url, body) => fetch(url, {method: 'POST', body: JSON.stringify(body)});

const inference = async args => {
  console.log('inferencing...');
  let result = await post(`${server}/hugging/`, args);
  if (result.status === 503) {
    console.warn('loading...[503]');
    const options = {...args?.options, wait_for_model: true};
    result = await post(`${server}/hugging/`, {...args, options});
  }
  console.log('complete.');
  return result;
};

const textInference = async options => {
  const response = await inference(options);
  return response.json();
};

const imageInference = async options => {
  const response = await inference(options);
  const result = await response.blob();
  return URL.createObjectURL(result);
};

export const HuggingFaceService = {
  async imageInference(host, options) {
    return {url: await imageInference(options)};
  },
  async textInference(host, options) {
    return textInference(options);
  }
};
