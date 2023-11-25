/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */


export const MobilenetNode = {
  $meta: {
    id: 'MobilenetNode',
    category: 'ML'
  },
  $stores: {
    Image: {
      $type: 'Image',
      connection: true,
      nomonitor: true
    },
    Model: {
      $type: 'HubModel',
      $value: {
        url: '../../third-party/mobilenet/mobilenet.min.js',
        input: '3, 256, 256',
        output: '1024'
      }
    },
    ClassifierResults: {
      $type: 'Pojo',
      noinspect: true
    }
  },
  classifier: {
    $kind: '$library/TensorFlow/Classifier',
    $inputs: [
      {imageRef: 'Image'},
      {model: 'Model'}
    ],
    $outputs: [
      {classifierResults: 'ClassifierResults'}
    ]
  }
};
