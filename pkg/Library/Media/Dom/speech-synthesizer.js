/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Synthesizer} from './Synthesizer.js';
import {Xen} from '../../Dom/Xen/xen-async.js';

export class SpeechSynthesizer extends Xen.Async {
  static get observedAttributes() {
    return ['text', 'lang', 'voice', 'pitch', 'rate'];
  }
  _didMount() {
    this.style.display = 'none';
    const enabler = () => {
      const lecture = new SpeechSynthesisUtterance('hello');
      lecture.volume = 0;
      speechSynthesis.speak(lecture);
      document.removeEventListener('click', enabler);
    };
    document.addEventListener('click', enabler);
  }
  update({text, lang, voice, pitch, rate}, state) {
    if (!state.synthesizer) {
      state.synthesizer = new Synthesizer();
    }
    // if (text !== state.text || voice !== state.voice) {
    //   state.voice = voice;
    //   state.text = text;
    //   if (text) {
        state.synthesizer.synthesize(text, lang, voice, pitch && Number(pitch), rate && Number(rate));
    //   }
    // }
  }
}

customElements.define('speech-synthesizer', SpeechSynthesizer);
