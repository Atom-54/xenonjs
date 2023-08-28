/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const TimeNode = {
  time: {
    type: '$library/Time/Atoms/Time',
    inputs: ['timeZone', 'timeOptions', 'precision'],
    outputs: ['time']
  }
};
