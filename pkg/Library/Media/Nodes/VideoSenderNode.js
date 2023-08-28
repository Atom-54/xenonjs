/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const VideoSenderNode = {
  VideoSender: {
    type: '$library/Media/Atoms/VideoSender',
    inputs: ['stream', 'frame'],
    outputs: ['stream']
  }
};