export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({mediaDeviceState, transcript}) {
  return mediaDeviceState && transcript;
},
update({mediaDeviceState, transcript}, state) {
  // TODO: (1) add speech cancel control, if audio was disabled,
  // (2) disable audio, when speech is finished.
  if (mediaDeviceState.isAudioEnabled && transcript && transcript !== state.text) {
    state.text = transcript;
    // return {mediaDeviceState : {...mediaDeviceState, isMicEnabled: false}};
  }
},
render({lang, voice}, {text}) {
  return {text, lang, voice};
},
template: html`
  <style>:host, * {display: none !important;}</style>
  <speech-synthesizer text="{{text}}" voice="{{voice}}" lang="{{lang}}"></speech-synthesizer>
`
});
