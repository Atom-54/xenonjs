/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { uint8ArrayToBase64 } from './base64.js';

export const EMBEDDING_VECTOR_LENGTH = 1536;
export const DEFAULT_MAX_TOKENS_COMPLETION = 1024; // tokens reserved for the answer
export const DEFAULT_MAX_TOKENS_FOR_MODEL = 4000; // max tokens for text-davinci-003
const MAX_TOKENS_FOR_MODEL = {
  "text-davinci-003": 4000,
  "openai.com:text-embedding-ada-002": 8191,
  "gpt-3.5-turbo": 4096,
  "gpt-4": 4096,
};

export function getMaxTokensForModel(model) {
  return MAX_TOKENS_FOR_MODEL[model] || DEFAULT_MAX_TOKENS_FOR_MODEL;
}

const dotProduct = function (vecA, vecB) {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
};

const magnitude = function (vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
};

// Cosine similarity is the dot products of the two vectors divided by the product of their magnitude
// https://en.wikipedia.org/wiki/Cosine_similarity
//
// We use this to compare two embedding vectors
export function cosineSimilarity(vecA, vecB) {
  return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}

export function decodeEmbedding(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return Array.from(new Float32Array(bytes.buffer));
  //return Array.from(new Float64Array(new Uint8Array(Buffer.from(data, "base64")).buffer));
}

export function encodeEmbedding(data) {
  const raw = new Float32Array(data).buffer;
  return uint8ArrayToBase64(new Uint8Array(raw), 'base64', false, null).result;
}

// export function encodeEmbedding(data) {
//     const binaryString = btoa(data);
//     return binaryString;
// }

export const fromObject = (data) => {
  if (data.query_embedding)
    data.query_embedding = decodeEmbedding(data.query_embedding);
  if (data.version)
    data.version = parseInt(data.version);
  if (data.count)
    data.count = parseInt(data.count);
  // Important: Using `endpointArgs` fills in good defaults.
  return schemas.endpointArgs.parse(data);
};

export const fromFormData = (formData) => {
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return fromObject(data);
};
