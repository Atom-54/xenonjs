/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const HolisticNode = {
  holistic: {
    type: '$library/Mediapipe/Atoms/Holistic',
    inputs: ['image'],
    outputs: ['results', 'mask']
  }
};
