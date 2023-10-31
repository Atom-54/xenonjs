/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const TextEmbeddingNode = {
  TextEmbedding: {
    type: '$library/OpenAI/Atoms/TextEmbedding',
    inputs: [/*'apiKey',*/ 'text'],
    outputs: ['vector']
  }
};