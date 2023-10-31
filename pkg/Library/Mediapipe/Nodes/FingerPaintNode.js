/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const FingerPaintNode = {
  FingerPaint: {
    type: '$library/Mediapipe/Atoms/FingerPaint',
    inputs: ['results', 'image', 'color', 'penSize', 'eraserSize'],
    outputs: ['image']
  }
};
