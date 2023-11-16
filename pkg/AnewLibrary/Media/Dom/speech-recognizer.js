/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Recognizer} from './Recognizer.js';
import {Xen} from '../../Dom/Xen/xen-async.js';

export class SpeechRecognizer extends Xen.Async {
  static get observedAttributes() {
    return ['enabled'];
  }
  _didMount() {
    this.style.display = 'none';
  }
  update({enabled}, state) {
    if (!state.recognizer) {
      state.recognizer = this.createRecognizer();
    }
    this.configureRecognizer(state.recognizer, enabled);
  }
  createRecognizer() {
    const onInit = () => {};
    const onResult = ({transcript, interimTranscript}) => {
      transcript = transcript.trim()
      this.value = {interimTranscript, transcript};
      this.fire('transcript', transcript);
    };
    const onEnd = () => {
      this.fire('end');
    };
    return new Recognizer(null, onInit, onResult, onEnd);
  }
  configureRecognizer(recognizer, enabled) {
    if (enabled && !recognizer.recognizing) {
      recognizer.start();
    } else if (!enabled && recognizer.recognizing) {
      recognizer.stop();
    }
  }
}

customElements.define('speech-recognizer', SpeechRecognizer);
