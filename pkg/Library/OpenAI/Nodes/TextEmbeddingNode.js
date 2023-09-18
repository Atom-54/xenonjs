/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const TextEmbeddingNode = {
  TextEmbedding: {
    type: '$library/Polymath/Atoms/TextEmbedding',
    inputs: [/*'apiKey',*/ 'text'],
    outputs: ['vector']
  }
};