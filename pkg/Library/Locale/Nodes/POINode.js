/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// DEPRECATED by POIFinderNode and POIDisplayNode.
export const POINode = {
  poi: {
    type: '$library/Locale/Atoms/Poi',
    inputs: ['geolocation', 'categories', 'radius', 'pageLength', 'selected'],
    outputs: ['locations', 'selected']
  }
};
