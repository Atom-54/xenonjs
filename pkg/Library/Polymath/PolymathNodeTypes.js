/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Polymath';

export const PolymathNodeTypes = {
  PolymathLibrary: {
    category,
    description: `A Polymath library contains queryable information`,  
    types: {
      PolymathLibrary$name: 'String',
      PolymathLibrary$library: 'PolymathLibrary'
    },
    type: '$library/Polymath/Nodes/PolymathLibraryNode',
    ligature: 'library_books'
  },
  PolymathLearner: {
    category,
    description: `Ingest new information into a Polymath library`,  
    types: {
      PolymathLearner$library: 'PolymathLibrary',
      PolymathLearner$type: 'LearnerType:String',
      PolymathLearner$typeValues: ['html'],
      PolymathLearner$source: 'String',
      PolymathLearner$content: 'MultilineText',
      PolymathLearner$trigger: 'Nonce'
    },
    type: '$library/Polymath/Nodes/PolymathLearnerNode',
    ligature: 'library_add'
  },
  AskPolymath: {
    category,
    description: `Query a Polymath library for information`,  
    types: {
      AskPolymath$library: 'PolymathLibrary',
      AskPolymath$query: 'MultilineText',
      AskPolymath$enabled: 'Boolean',
      AskPolymath$trigger: 'Nonce',
      AskPolymath$result: 'PolymathResult',
      AskPolymath$completion: 'MultilineText',
      AskPolymath$working: 'Boolean'
    },
    type: '$library/Polymath/Nodes/AskPolymathNode',
    ligature: 'local_library'
  },
  WikipediaContent: {
    category,
    description: `Find Wikipedia page content for a query`,  
    types: {
      WikipediaContentNode$query: 'MultilineText',
      WikipediaContentNode$title: 'String',
      WikipediaContentNode$markup: 'HTML:MultilineText'
    },
    type: '$library/Polymath/Nodes/WikipediaContentNode',
    ligature: 'book'
  }
};
