/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const GraphFlannerNode = {
  GraphFlanner: {
    type: '$library/NeonFlan/Atoms/GraphFlanner',
    inputs: ['graphs', 'query', 'label'],
    outputs: ['graph', 'graphJson', 'query']
  },

  state: {
    GraphFlanner$label: 'I want to:'
    // GraphFlanner$graphs: [{
    //   "id":"ImageCompletion",
    //   "description":"complete image with an AI generated image "
    // }, {
    //   "id":"ImageGeneration",
    //   "description":"generate an image using a HuggingFace model of your choice"
    // }, {
    //   "id":"ImageSearch",
    //   "description":"query Pixabay for images"
    // }, {
    //   "id":"KnowledgeSpace",
    //   "description":"query OpenAI and get structured responses"
    // }, {
    //   "id":"LocalWeather",
    //   "description":"renders map and weather forecast for the current location"
    // }, {
    //   "id":"VideoBackgroundGen",
    //   "description":"OpenAI-generated background for video stream"
    // }, {
    //   "id":"VideoFingerpaint",
    //   "description":"colorful fingerpainging on the streamed video"
    // }, {
    //   "id":"VideoFire",
    //   "description":"fire background on the streamed video "
    // }, {
    //   "id":"VideoLake",
    //   "description":"lake effect on the streamed video"
    // }, {
    //   "id":"VideoRain",
    //   "description":"rain effect and water wiping on the streamed video"
    // }, {
    //   "id": "TranslateWithAudio",
    //   "description": "text translation and transcribing for selected languages and listen and speak interface and listen and speak interface",
    // }, {
    //   "id":"OpenAIQnA",
    //   "description":"voice interface for OpenAI and listen and speak interface and listen and speak interface and listen and speak interface"    
    // }, {
    //   "id": "PointsOfInterest",
    //   "description": "find local attractions for selected location"
    // }],
  }
};
