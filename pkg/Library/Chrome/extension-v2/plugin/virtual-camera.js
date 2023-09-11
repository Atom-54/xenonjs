/**
 * @license
 * Copyright 2023 PurpleIonPower LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const builtin = navigator.mediaDevices;
const fallback = MediaDevices.prototype;

let asyncStreamGetter;

// call this to initiate vritualCamera attached to asyncStreamGetter
export const createVirtualCamera = _asyncStreamGetter => {
  asyncStreamGetter = _asyncStreamGetter;
  builtin.getUserMedia = getUserMedia;
  builtin.enumerateDevices = enumerateDevices;
  builtin.dispatchEvent(
    new CustomEvent('devicechange')
  );
};

const virtualCamera = {
  deviceId: 'XenonJsCamera',
  groupID: 'Xenon',
  kind: 'videoinput',
  label: 'Xenon Virtual Camera'
};

const enumerateDevices = async function () {
  const devices = await fallback.enumerateDevices.call(this);
  return [...devices, virtualCamera];
};

const getUserMedia = async function (constraints) {
  if (constraints) {
    const videoDeviceId = getDeviceId(constraints.video);
    if (videoDeviceId === virtualCamera.deviceId) {
      return marshalVirtualStream(constraints);
    } else {
      return fallback.getUserMedia.call(this, constraints);
    }
  }
};

const marshalVirtualStream = async ({audio, video}) => {
  const stream = await asyncStreamGetter(video);
  if (audio) {
    const audioStream = await fallback.getUserMedia.call(this, {audio, video: false});
    for (const track of audioStream.getAudioTracks()) {
      stream.addTrack(track);
    }
  }
  return stream;
};

const getDeviceId = videoConstraints => {
  if (typeof videoConstraints === 'boolean') {
    return null;
  }
  if (!videoConstraints?.deviceId) {
    return null;
  }
  if (typeof videoConstraints.deviceId === 'string') {
    return videoConstraints.deviceId;
  }
  if (videoConstraints.deviceId instanceof Array) {
    return videoConstraints.deviceId[0];
  }
  return videoConstraints.deviceId.exact ?? null;
};
