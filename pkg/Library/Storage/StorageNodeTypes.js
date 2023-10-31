/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Media';

export const StorageNodeTypes = {
  StoreImage: {
    category,
    description: 'Stores the given image',
    types: {
      StoreImage$image: 'Image',
      StoreImage$storedImage: 'Image'
    },
    type: '$library/Storage/Nodes/StoreImageNode'
  },
  ImageGallery: {
    category,
    description: 'Displays image gallery',
    types: {
      ImageGallery$image: 'Image'
    },
    type: '$library/Storage/Nodes/ImageGalleryNode'
  }
};
