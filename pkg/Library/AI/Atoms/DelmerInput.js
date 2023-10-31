export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({mediaDeviceState}) {
  return {mediaDeviceState};
},
render({mediaDeviceState}) {
  if (!mediaDeviceState) {
    return {hide: true};
  }
  return this.renderDeviceState(mediaDeviceState);
},
renderDeviceState(mediaDeviceState) {
  const {isMicEnabled, isAudioEnabled} = mediaDeviceState || {};
  return {
    hide: false,
    micLigature: isMicEnabled ? `mic` : `mic_off`,
    audioLigature: isAudioEnabled ? `volume_up` : `volume_off`,
  };
},
renderDevices(devices, kind, selectedDeviceId) {
  return devices
    .filter(d => d.kind === kind)
    .map(d => ({...d, selected: Boolean(selectedDeviceId && d.key === selectedDeviceId)}))
    ;
},
toggleDeviceStateBool(mediaDeviceState, stateProperty) {
  return {
    ...mediaDeviceState,
    [stateProperty]: !mediaDeviceState[stateProperty]
  };
},
onMicClick({mediaDeviceState}) {
  // const output = this.toggleDeviceStateBool(mediaDeviceState, 'isMicEnabled');
  return {
    mediaDeviceState: this.toggleDeviceStateBool(mediaDeviceState, 'isMicEnabled'),
    transcript: null
  };
},
onAudioClick({mediaDeviceState}) {
  return {
    mediaDeviceState: this.toggleDeviceStateBool(mediaDeviceState, 'isAudioEnabled'),
  };
},
onSelectChange({eventlet: {key, value}, mediaDeviceState}) {
  if (key && value) {
    return {
      mediaDeviceState: {
        ...mediaDeviceState,
        [key]: value
      }
    };
  }
},
template: html`
<style>
  :host {
    display: flex;
    color: white;
  }
  icon {
    /* --size: 24px;
    width: var(--size);
    height: var(--size); */
    margin-right: 4px;
  }
  [toolbar] {
    /* margin-bottom: 16px;
    padding: 6px 16px 12px 16px; */
    border-radius: 8px;
    border: 1px solid #ffffff10;
    background: #33333340;
  }
  [bottom] {
    align-items: flex-end;
    justify-content: center;
  }
</style>

<div flex row bottom hide$="{{hide}}">
  <div toolbar>
    <icon on-click="onMicClick">{{micLigature}}</icon>
    <icon on-click="onAudioClick">{{audioLigature}}</icon>
  </div>
</div>
`
});
