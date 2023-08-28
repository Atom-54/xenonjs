/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const SelfieSegmentationNode = {
  SelfieSegmentation: {
    type: '$library/Mediapipe/Atoms/SelfieSegmentation',
    inputs: ['image'],
    outputs: ['mask']
  }
};
