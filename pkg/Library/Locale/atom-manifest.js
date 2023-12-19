/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Location';

export const LocaleNodeTypes = {
  Geolocation: {
    categories: [category],
    description: 'Fetches and returns the current location or a selected location',
    displayName: 'Geo Location',
    type: '$library/Locale/Atoms/Geolocation',
    ligature: 'location_on',
    inputs: {
      geolocation: 'Geolocation',
      address: 'String',
      live: 'Boolean'
    },
    outputs: {
      geolocation: 'Geolocation'
    }
  },
  // TODO(maria): update Weather and POIs graphs to use Geolocation atom above.
  // MyLocation: {
  //   categories: [category],
  //   description: 'Fetches and returns the current location',
  //   types: {
  //     location$geolocation: 'Geolocation',
  //     location$address: 'String',
  //     location$live: 'Boolean'
  //   },
  //   type: '$library/Locale/Atoms/MyLocationNode'
  // },
  // ChooseLocation: {
  //   categories: [category],
  //   description: 'Renders an input for location selection, and return corresponding coordinates',
  //   types: {
  //     location$geolocation: 'Geolocation',
  //     location$address: 'String',
  //     location$live: 'Boolean'
  //   },
  //   type: '$library/Locale/Atoms/ChooseLocationNode'
  // },
  GoogleMap: {
    categories: [category],
    description: 'Renders Google map centered on the given location',
    displayName: 'Google Map',
    type: '$library/Locale/Atoms/GoogleMap',
    ligature: 'map',
    inputs: {
      geolocation: 'Geolocation',
      markers: '[Geolocation]'
    }, 
    outputs: {
      markers: '[Geolocation]'
    }
  },
  Weather: {
    categories: [category],
    description: 'Fetches and renders the weather forecast for the given location',
    type: '$library/Locale/Atoms/WeatherNode',
    ligature: 'partly_cloudy_day',
    inputs: {
      Geolocation: 'Geolocation'
    },
    outputs: {
      weather: 'Pojo'
    }
  },
  Translate: {
    categories: [category],
    description: 'Translates the given text into the requested language',
    type: '$library/Locale/Atoms/Translate',
    ligature: 'translate',
    inputs: {
      text: 'String',
      inLang: 'String',
      outLang: 'String',
      enabled: 'Boolean',
      trigger: 'Nonce'
    },
    outputs: {
      translation: 'String',
      working: 'Boolean'
    }
  },
  // TODO(maria): This is obsolete. Verify POIs graph and delete this.
  // PointsOfInterest: {
  //   categories: [category],
  //   description: 'Fetches and renders points of interest for the given location',
  //   types: {
  //     poi$geolocation: 'Geolocation',
  //     poi$radius: 'Number'
  //   },
  //   type: '$library/Locale/Atoms/POI',
  //   ligature: 'public'
  // },
  PointOfInterestFinder: {
    categories: [category],
    description: 'Finds points of interest',
    displayName: 'Attractions Finter',
    // types: {
    //   poi$geolocation: 'Geolocation',
    //   // poi$radius: 'Number',
    //   filter$restart: 'Boolean'
    // },
    type: '$library/Locale/Atoms/POIFinder',
    ligature: 'travel_explore',
    inputs: {
      geolocation: 'Geolocation',
      filter: 'String',
      radius: 'Number',
      selected: 'String'
    },
    outputs: {
      location: 'Pojo',
      locations: '[Pojo]',
      request: 'String',
      restart: 'Boolean',
      result: 'String',
    }
  },
  PointOfInterestDisplay: {
    categories: [category],
    description: 'Display information of the given point of interest',
    displayName: 'Points of Interest Display',
    type: '$library/Locale/Atoms/POIDisplay',
    ligature: 'public',
    inputs: {
      location: 'Location'
    }
  }
};
