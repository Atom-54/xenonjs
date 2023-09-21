/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const POIFinderNode = {
  poi: {
    type: '$library/Locale/Atoms/POIFinder',
    inputs: ['geolocation', 'filter', 'radius', 'selected'],
    outputs: ['locations', 'location'],
    bindings: {result: 'filter$result'}
  },
  filter: {
    type: '$library/OpenAI/Atoms/OpenAIText',
    inputs: ['context', 'prompt', 'enabled', 'restart'],
    outputs: ['working'],
    bindings: {
      prompt: 'poi$request',
      restart: 'poi$restart'
    },
  },
  state: {
    filter$context: `Given a list of places, please answer questions about them.
      You should reply with a simple "yes", "no" or "don't know" about each place`,
    filter$restart: false,
    filter$enabled: true
  }
};
