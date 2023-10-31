/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const MyLocationNode = {
  location: {
    type: '$library/Locale/Atoms/Geolocation',
    inputs: ['geolocation', 'address', 'live'],
    outputs: ['geolocation']
  },
  state: {
    location$address: 'My Location'
  }
};
