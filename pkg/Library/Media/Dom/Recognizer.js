/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export class Recognizer {
  constructor(language, initCallback, callback, endCallback) {
    this._reco = new webkitSpeechRecognition();
    this._reco.continuous = true;
    this._reco.interimResults = true;
    this._reco.onstart = this._onstart.bind(this);
    this._reco.onerror = this._onerror.bind(this);
    this._reco.onend = this._onend.bind(this);
    this._reco.onresult = this._onresult.bind(this);
    this._initCallback = initCallback;
    this._callback = callback;
    this._endCallback = endCallback;
    this._reco.lang = language ? language : "en-US";
    this.recognizing = false;
  }
  _onstart() {
    this._initcallback?.(this);
    console.log('Recognizer: listening...');
    this.recognizing = true;
  }
  _onerror(err) {
    console.log(err);
  }
  _onend() {
    this.recognizing = false;
    this._endCallback?.(this);
    console.log('Recognizer: disabled.');
  }
  _onresult(event) {
    let final_transcript = '';
    let interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      this._reco.stop();
      console.warn('Recognizer', "browser doesn't seem to support reco");
      console.warn(event);
      return;
    }
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        console.log("Recognizer: "+final_transcript);
    } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    this.transcript = final_transcript;
    this.interimTranscript = interim_transcript;
    this._callback?.(this);
  }
  stop() {
    console.log('Recognizer: stopping...');
    this._reco.stop();
  }
  start() {
    try {
      console.log('Recognizer: starting...');
      this._reco.start();
    } catch (e) {
      console.warn('Recognizer', e.message); // frequently that the reco is running
    }
  }
}
