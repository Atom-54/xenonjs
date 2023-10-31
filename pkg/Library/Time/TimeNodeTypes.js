/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Date&Time';

export const DateTimeTypes = {
  Time: {
    category,
    description: 'Provides the current time at the given timezone; auto-updates periodically, if precision is set',
    types: {
      time$precision: 'Number',
      time$timeOptions: 'Pojo',
      time$timeZone: 'String'
    },
    type: '$library/Time/Nodes/TimeNode'
  },
  TimeZones: {
    category,
    description: 'Provides list of all existing timezones and the current timezone',
    types: {
      time$timeZones: '[String]',
      time$timeZone: 'String'
    },
    type: '$library/Time/Nodes/TimeZonesNode'
  }
};
