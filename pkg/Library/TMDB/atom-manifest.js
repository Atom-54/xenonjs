/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'TMDB';

export const TMDB = {
  TMDB: {
    categories: [category],
    description: 'The Movie Database',
    displayName: 'TheMovieDB',
    type: `$library/${category}/Atoms/TMDB`,
    ligature: 'movie',
    inputs: {
      query: 'String'
    },
    outputs: {
      results: 'Json'
    }
  }
};
