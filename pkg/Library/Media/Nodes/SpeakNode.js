/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const SpeakNode = {
  SpeechSynthesizer: {
    type: '$library/Media/Atoms/SpeechSynthesizer',
    inputs: ['voice', 'transcript', 'lang', 'mediaDeviceState'],
    outputs: ['mediaDeviceState']
  }
};
