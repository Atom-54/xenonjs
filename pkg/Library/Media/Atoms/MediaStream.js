export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({streamId, mediaDeviceState}) {
  const {isCameraEnabled, isMicEnabled, videoDeviceId, audioInputDeviceId} = mediaDeviceState || {};
  return {
    playingVideo: Boolean(isCameraEnabled),
    playingAudio: Boolean(isMicEnabled),
    videoDeviceId,
    audioInputDeviceId,
    streamId
  };
},
onMediaDevices({eventlet: {value}}) {
  const mediaDevices = create(null);
  for (const device of value) {
    let {deviceId, kind, label, groupId} = device;
    mediaDevices[`${kind}:${label}`] = {deviceId, kind, label, groupId};
  }
  return {mediaDevices};
},
onStream({eventlet: {key}}) {
  const stream = {id: key, version: Math.random()};
  return {stream};
},
template: html`
<style>
  :host, media-stream {
    display: none !important;
  }
</style>
<media-stream
  streamid="{{streamId}}"
  playingvideo="{{playingVideo}}"
  playingaudio="{{playingAudio}}"
  videoDeviceId="{{videoDeviceId}}"
  audioInputDeviceId="{{audioInputDeviceId}}"
  on-devices="onMediaDevices"
  on-stream="onStream"
  >
</media-stream>
`
});
