/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Media';

export const Media = {
  Image: {
    category,
    description: 'Displays an image',
    ligature: 'image',
    type: '$anewLibrary/Media/Atoms/Image',
    inputs: {
      image: 'Image',
      selfie: 'Boolean'
    }
  }
};