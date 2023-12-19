/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Polymath';

export const PolymathNodeTypes = {
  PolymathLibrary: {
    categories: [category],
    description: 'A Polymath library contains queryable information',
    type: '$library/Polymath/Atoms/PolymathLibrary',
    ligature: 'library_books',
    inputs: {
      name: 'String'
    },
    outputs: {
      library: 'PolymathLibrary'
    }
  },
  PolymathLearner: {
    categories: [category],
    description: 'Ingest new information into a Polymath library',
    type: '$library/Polymath/Atoms/PolymathLearner',
    ligature: 'library_add',
    inputs: {
      library: 'PolymathLibrary',
      type: 'LearnerTypes:String',
      source: 'String',
      content: 'MultilineText',
      trigger: 'Nonce'
    },
    outputs: {
      ok: 'Boolean',
      learning: 'Boolean'
    },
    types: {
      LearnerTypes: ['html']
    }
  },
  AskPolymath: {
    categories: [category],
    description: 'Query a Polymath library for information',
    type: '$library/Polymath/Atoms/AskPolymath',
    ligature: 'local_library',
    inputs: {
      library: 'PolymathLibrary',
      query: 'MultilineText',
      enabled: 'Boolean',
      trigger: 'Nonce'
    },
    outputs: {
      result: 'PolymathResult',
      completion: 'MultilineText',
      // query: 'MultilineText', // Is this needed?
      working: 'Boolean'
    }
  },
  WikipediaContent: {
    categories: [category],
    description: 'Find Wikipedia page content for a query',
    type: '$library/Polymath/Atoms/WikipediaContent',
    ligature: 'book',
    inputs: {
      query: 'MultilineText',
      trigger: 'Nonce'
    },
    outputs: {
      title: 'String',
      markup: 'HTML:MultilineText'
    }
  }
};
