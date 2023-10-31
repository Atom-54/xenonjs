export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({mediaDeviceState}) {
  return {
    micEnabled: Boolean(mediaDeviceState?.isMicEnabled)
  };
},
onTranscript({eventlet: {value}}) {
  return value;
},
onEnd({mediaDeviceState}) {
  // return {
  //   mediaDeviceState: {...mediaDeviceState, isMicEnabled: false}
  // };
},
template: html`
<style>:host, * { display: none !important; }</style>
<speech-recognizer enabled="{{micEnabled}}" on-transcript="onTranscript" on-end="onEnd"></speech-recognizer>
`
});
