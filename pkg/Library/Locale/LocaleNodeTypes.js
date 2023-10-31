/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Location';

export const LocaleNodeTypes = {
  Geolocation: {
    category,
    description: '[deprecated?] Fetches and returns the current location or a selected location',
    types: {
      location$geolocation: 'Geolocation',
      location$address: 'String',
      location$live: 'Boolean'
    },
    type: '$library/Locale/Nodes/GeolocationNode'
  },
  MyLocation: {
    category,
    description: 'Fetches and returns the current location',
    types: {
      location$geolocation: 'Geolocation',
      location$address: 'String',
      location$live: 'Boolean'
    },
    type: '$library/Locale/Nodes/MyLocationNode'
  },
  ChooseLocation: {
    category,
    description: 'Renders an input for location selection, and return corresponding coordinates',
    types: {
      location$geolocation: 'Geolocation',
      location$address: 'String',
      location$live: 'Boolean'
    },
    type: '$library/Locale/Nodes/ChooseLocationNode'
  },

  GoogleMap: {
    category,
    description: 'Renders Google map centered on the given location',
    types: {
      map$geolocation: 'Geolocation',
      map$markers: '[Geolocation]'
    },
    type: '$library/Locale/Nodes/GoogleMapNode'
  },
  Weather: {
    category,
    description: 'Fetches and renders the weather forecast for the given location',
    types: {
      weather$Geolocation: 'Geolocation'
    },
    type: '$library/Locale/Nodes/WeatherNode'
  },
  Translate: {
    category,
    description: 'Translates the given text into the requested language',
    types: {
      translate$text: 'String',
      translate$inLang: 'String',
      translate$outLang: 'String',
      translate$enabled: 'Boolean',
      translate$trigger: 'Nonce',
      translate$translation: 'String',
      translate$working: 'Boolean'
    },
    type: '$library/Locale/Nodes/TranslateNode'
  },
  PointsOfInterest: {
    category,
    description: 'Fetches and renders points of interest for the given location',
    types: {
      poi$geolocation: 'Geolocation',
      poi$radius: 'Number'
    },
    type: '$library/Locale/Nodes/POINode'
  },
  PointOfInterestFinder: {
    category,
    description: 'Finds points of interest',
    types: {
      poi$geolocation: 'Geolocation',
      // poi$radius: 'Number',
      filter$restart: 'Boolean'
    },
    type: '$library/Locale/Nodes/POIFinderNode'
  },
  PointOfInterestDisplay: {
    category,
    description: 'Display information of the given point of interest',
    types: {
      poi$location: 'Location'
    },
    type: '$library/Locale/Nodes/POIDisplayNode'
  }
};
