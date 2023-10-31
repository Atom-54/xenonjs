/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const FrameCaptureNode = {
  FrameCapture: {
    type: '$library/Media/Atoms/FrameCapture',
    inputs: ['stream', 'fps'],
    outputs: ['frame']
  },
  state: {
    FrameCapture$fps: 30
  }
};
