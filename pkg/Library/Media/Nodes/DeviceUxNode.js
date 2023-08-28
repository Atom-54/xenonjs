/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const DeviceUxNode = {
  deviceUx: {
    type: '$library/Media/Atoms/DeviceUx',
    inputs: ['mediaDeviceState'],
    outputs: ['mediaDeviceState'],
    // my input can come from their private output
    bindings: {mediaDevices: 'defaultStream$mediaDevices'},
  },
  defaultStream: {
    type: '$library/Media/Atoms/MediaStream',
    container: 'deviceUx',
    state: {
      streamId: 'default'
    },
    inputs: ['streamId'],
    outputs: ['stream'],
    // my private input comes from their private output
    bindings: {mediaDeviceState: 'deviceUx$mediaDeviceState'},
  }
};
