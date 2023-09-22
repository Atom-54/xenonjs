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
    type: '$library/Polymath/Nodes/PolymathLibraryNode'
  },
  PolymathLearner: {
    category,
    description: `Ingest new information into a Polymath library`,  
    types: {
      PolymathLearner$library: 'PolymathLibrary',
      PolymathLearner$type: 'LearnerType|String',
      PolymathLearner$typeValues: ['html'],
      PolymathLearner$source: 'String',
      PolymathLearner$content: 'MultilineText',
      PolymathLearner$trigger: 'Nonce'
    },
    type: '$library/Polymath/Nodes/PolymathLearnerNode'
  },
  AskPolymath: {
    category,
    description: `Query a Polymath library for information`,  
    types: {
      AskPolymath$library: 'PolymathLibrary',
      AskPolymath$query: 'MultilineText',
      AskPolymath$result: 'PolymathResult',
      AskPolymath$completion: 'MultilineText'
    },
    type: '$library/Polymath/Nodes/AskPolymathNode'
  },
  WikipediaContent: {
    category,
    description: `Find Wikipedia page content for a query`,  
    types: {
      WikipediaContentNode$query: 'MultilineText',
      WikipediaContentNode$title: 'String',
      WikipediaContentNode$markup: 'HTML|MultilineText'
    },
    type: '$library/Polymath/Nodes/WikipediaContentNode'
  }
};
