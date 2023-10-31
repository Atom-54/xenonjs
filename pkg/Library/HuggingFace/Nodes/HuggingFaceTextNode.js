/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const HuggingFaceTextNode = {
  HuggingFace: {
    type: '$library/HuggingFace/Atoms/HuggingFaceText',
    inputs: ['prompt', 'model', 'options'],
    outputs: ['result', 'working']
  }
};
