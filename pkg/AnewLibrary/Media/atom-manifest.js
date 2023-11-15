/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const categories = ['Media'];

export const Media = {
  Image: {
    categories,
    description: 'Displays an image',
    ligature: 'image',
    type: '$anewLibrary/Media/Atoms/Image',
    inputs: {
      image: 'Image',
      selfie: 'Boolean'
    }
  }
};