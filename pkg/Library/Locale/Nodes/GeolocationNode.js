/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// Maybe deprecated by MyLocationNode and/or ChooseLocationNode?
export const GeolocationNode = {
  location: {
    type: '$library/Locale/Atoms/Geolocation',
    inputs: ['geolocation', 'address', 'live'],
    outputs: ['geolocation']
  }
};
