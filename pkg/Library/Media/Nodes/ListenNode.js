/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const ListenNode = {
  SpeechRecognizer: {
    type: '$library/Media/Atoms/SpeechRecognizer',
    inputs: ['mediaDeviceState'],
    outputs: ['transcript', 'interimTranscript', 'mediaDeviceState']
  }
};