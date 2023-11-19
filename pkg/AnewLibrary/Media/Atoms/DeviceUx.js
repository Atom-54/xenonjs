export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({mediaDeviceState}, state) {
  if (!mediaDeviceState) {
    delete state.mediaDeviceState;
    mediaDeviceState = {
      isCameraEnabled: false,
      isMicEnabled: false,
      isAudioEnabled: false
    };
  }
  if (!deepEqual(mediaDeviceState, state.mediaDeviceState)) {
    state.mediaDeviceState = mediaDeviceState;
    return {mediaDeviceState}
  }
},
// render({mediaDevices, mediaDeviceState}) {
render({mediaDevices}, {mediaDeviceState}) {
  mediaDevices ??= {};
  const {isCameraEnabled, isMicEnabled, isAudioEnabled, videoDeviceId, audioInputDeviceId, audioOutputDeviceId} = mediaDeviceState || {};
  const showCamera = String(isCameraEnabled !== undefined);
  const showSpeaker = String(isAudioEnabled !== undefined);
  const cameraEnabled = Boolean(isCameraEnabled);
  const micEnabled = Boolean(isMicEnabled);
  const audioEnabled = Boolean(isAudioEnabled);
  const devices = values(mediaDevices).map(d => ({name: d.label || 'default', kind: d.kind, key: d.deviceId}));
  const videoInputs = this.renderDevices(devices, 'videoinput', videoDeviceId);
  const audioInputs = this.renderDevices(devices, 'audioinput', audioInputDeviceId);
  const audioOutputs = this.renderDevices(devices, 'audiooutput', audioOutputDeviceId);
  return {
    videoInputs,
    audioInputs,
    audioOutputs,
    showCamera,
    cameraEnabled,
    cameraLigature: cameraEnabled ? `videocam` : `videocam_off`,
    micEnabled,
    micLigature: isMicEnabled ? `mic` : `mic_off`,
    showSpeaker,
    audioEnabled,
    audioLigature: audioEnabled ? `volume_up` : `volume_off`
  };
},
renderDevices(devices, kind, selectedDeviceId) {
  return devices
    .filter(d => d.kind === kind)
    .map(d => ({...d, selected: Boolean(selectedDeviceId && d.key === selectedDeviceId)}))
    ;
},
onCameraClick({}, state) {
  state.mediaDeviceState = {
    ...state.mediaDeviceState,
    isCameraEnabled: !state.mediaDeviceState.isCameraEnabled
  };
  return {
    mediaDeviceState: state.mediaDeviceState
  };
},
// onMicClick({mediaDeviceState}, state) {
onMicClick({}, state) {
  state.mediaDeviceState = {
    ...state.mediaDeviceState,
    isMicEnabled: !state.mediaDeviceState.isMicEnabled
  };
  return {
    mediaDeviceState: state.mediaDeviceState,
    transcript: null
  };
},
onAudioClick({}, state) {
  state.mediaDeviceState = {
    ...state.mediaDeviceState,
    isAudioEnabled: !state.mediaDeviceState.isAudioEnabled
  };
  return {
    mediaDeviceState: state.mediaDeviceState
  };
},
onSelectChange({eventlet: {key, value}}, state) {
  if (key && value) {
    state.mediaDeviceState = {
      ...state.mediaDeviceState,
      [key]: value
    };
    return {
      mediaDeviceState: state.mediaDeviceState
    };
  }
},
template: html`
<style>
  :host {
    flex: 0 !important;
    overflow: visible !important;
  }
  [scrub][toolbar] {
    font-size: 20px;
  }
  icon {
    font-size: 18px;
    margin-right: 2px !important;
    cursor: pointer;
  }
  select {
    width: 16px;
    background-color: transparent;
    border: none;
    color: inherit;
  }
</style>

<div scrub toolbar>
  <icon show$="{{showCamera}}" on-click="onCameraClick">{{cameraLigature}}</icon>
  <select show$="{{showCamera}}" repeat="option_t" on-change="onSelectChange" key="videoDeviceId">{{videoInputs}}</select>
  <icon on-click="onMicClick">{{micLigature}}</icon>
  <select repeat="option_t" on-change="onSelectChange" key="audioInputDeviceId">{{audioInputs}}</select>
  <icon show$="{{showSpeaker}}" on-click="onAudioClick">{{audioLigature}}</icon>
  <select show$="{{showSpeaker}}" repeat="option_t" on-change="onSelectChange" key="audioOutputDeviceId">{{audioOutputs}}</select>
  <span flex></span>
</div>
<template option_t>
  <option value="{{key}}" selected="{{selected}}">{{name}}</option>
</template>

<div>{{devices}}</div>
<slot name="micbox"></slot>
`
});
