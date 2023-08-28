/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export class Synthesizer {
  synthesize(text, lang, voiceName, pitch, rate) {
    const utterance = new SpeechSynthesisUtterance(text);
    Object.assign(utterance, {
      voice: speechSynthesis.getVoices().find(voice => voice.name == voiceName),
      // 0 .. 2 (default 1)
      pitch: pitch ??= 1,
      // 0.1 ... 10 (default 1)
      rate: rate ??= 0.8, //0.9
      lang: lang ??= 'en-US'
    });
    speechSynthesis.speak(utterance);
  }
}
