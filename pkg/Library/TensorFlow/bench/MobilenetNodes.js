/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
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
