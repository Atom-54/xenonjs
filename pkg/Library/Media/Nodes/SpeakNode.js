/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const SpeakNode = {
  SpeechSynthesizer: {
    type: '$library/Media/Atoms/SpeechSynthesizer',
    inputs: ['voice', 'transcript', 'lang', 'mediaDeviceState'],
    outputs: ['mediaDeviceState']
  }
};
