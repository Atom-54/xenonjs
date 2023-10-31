/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const ChooseLocationNode = {
  panel: {
    type: '$library/Layout/Atoms/Panel'
  },
  location: {
    type: '$library/Locale/Atoms/Geolocation',
    inputs: ['geolocation', 'live'],
    outputs: ['geolocation'],
    container: 'panel#Container',
    bindings: {
      'address': 'choose$value'
    }
  },
  choose: {
    type: '$library/Fields/Atoms/TextField',
    inputs: ['label', 'value', 'options'],
    container: 'panel#Container'
  },
  state: {
    choose$label: 'Location',
    choose$options: ['My Location']
  }
};
