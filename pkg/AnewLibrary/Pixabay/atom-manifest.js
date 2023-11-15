/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const categories = 'Pixabay';

export const Pixabay = {
  PixabayImage: {
    categories,
    description: 'Find images from Pixbay',
    ligature: 'image',
    type: '$anewLibrary/Pixabay/Atoms/Pixabay',
    inputs: {
      query: 'String',
      image: 'Image',
      retry: 'Nonce',
      index: 'Number'
    }
  }
};