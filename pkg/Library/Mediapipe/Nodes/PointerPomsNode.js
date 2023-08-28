/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PointerPomsNode = {
  PointerPoms: {
    type: '$library/Mediapipe/Atoms/PointerPoms',
    inputs: ['tracking', 'penSize', 'eraserSize', 'erase', 'color'],
    outputs: ['image']
  }
};
