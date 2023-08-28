/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const HolisticNode = {
  holistic: {
    type: '$library/Mediapipe/Atoms/Holistic',
    inputs: ['image'],
    outputs: ['results', 'mask']
  }
};
