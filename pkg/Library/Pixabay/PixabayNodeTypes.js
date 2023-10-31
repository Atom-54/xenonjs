/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Media';

export const PixabayNodeTypes = {
  Pixabay: {
    category,
    description: 'Searches and browses images for the given query',
    types: {
      pixabay$query: 'String',
      pixabay$image: 'Image',
      pixabay$trigger: 'Nonce',
      pixabay$index: 'Number'
    },
    type: '$library/Pixabay/Nodes/PixabayNode'
  }
};
