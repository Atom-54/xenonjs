export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({mediaDeviceState}, state) {
  state.mediaDeviceState = mediaDeviceState;
},
render({}, {mediaDeviceState}) {
  return {
    micEnabled: Boolean(mediaDeviceState?.isMicEnabled)
  };
},
onTranscript({eventlet: {value}}) {
  return value;
},
onEnd({mediaDeviceState}, state) {
  // state.mediaDeviceState = {...mediaDeviceState, isMicEnabled: false};
  // return {
  //   mediaDeviceState: state.mediaDeviceState
  // };
},
template: html`
<style>:host, * { display: none !important; }</style>
<speech-recognizer enabled="{{micEnabled}}" on-transcript="onTranscript" on-end="onEnd"></speech-recognizer>
`
});
