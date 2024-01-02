/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Documents';

export const Documents = {
  Folders: {
    categories: [category, 'Common'],
    displayName: 'Folders',
    ligature: 'folder',
    type: '$library/Documents/Atoms/Folders',
    inputs: {
      storeId: 'String',
      userId: 'String'
    },
    outputs: {
      folders: 'Json|Folders'
    }
  },
  FileSystem: {
    categories: [category, 'Data'],
    displayName: 'FileSystem',
    ligature: 'folder',
    type: '$library/Documents/Atoms/FileSystem',
    inputs: {
      providerId: 'String',
      storeId: 'String',
      authToken: 'String'
    },
    outputs: {
      folders: 'Json|Folders'
    }
  },
  FileSystemFolders: {
    categories: [category, 'Data'],
    displayName: 'FileSystem Folders',
    ligature: 'folder',
    type: '$library/Documents/Atoms/FileSystemFolders',
    outputs: {
      folders: 'Json|Folders'
    }
  },
  TextDocument: {
    categories: [category, 'Common'],
    displayName: 'Text Document',
    ligature: 'article',
    type: '$library/Documents/Atoms/TextDocument',
    inputs: {
      content: 'String',
      document: 'Json|Document'
    }
  }
};
