export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({geolocation, address}, state, {service}) {
  if (address && !this.isMyLocation(address)) {
    if (state.address !== address) {
      state.address = address;
      return this.fetchCoords(address, state, service);
    }
  }
  if (this.isMyLocation(address)) {
    geolocation = state.liveLocation;
  }
  if (geolocation && this.coordsChanged(geolocation, state.coords)) {
    return this.fetchReverseCoords(geolocation, state, service);
  }
  if (!geolocation) {
    return {geolocation: {}};
  }
},

async fetchCoords(address, state, service) {
  const response = await service('GoogleApisService', 'coords', {address});
  const result = response?.results?.[0];
  if (result?.geometry?.location) {
    const {lat: latitude, lng: longitude} = result.geometry.location;
    state.coords = {latitude, longitude};
    return {geolocation: this.formatLocation({latitude, longitude}, result)};
  }
},

async fetchReverseCoords(coords, state, service) {
  state.coords = coords;
  const response = await service('GoogleApisService', 'reverseCoords', {coords});
  const result = response?.results?.[0];
  if (result) {
    return {geolocation: this.formatLocation(coords, result)};
  }
},

coordsChanged({latitude, longitude}, location) {
  return (latitude !== location?.latitude) || (longitude !== location?.longitude);
},

async onCoords({eventlet: {value}, address, live}, state, {service}) {
  state.liveLocation = value;
  if (live || this.isMyLocation(address)) {
    return {geolocation: value};
  }
},

isMyLocation(address) {
  return address?.toLowerCase() === 'my location';
},

formatLocation(coords, {address_components: addressComponents}) {
  const countryComponent = addressComponents?.find(r => r.types.includes('country'));
  const cityComponent = addressComponents?.find(r => r.types.includes('locality'));
  const country = countryComponent?.short_name || 'unknown';
  const countryFullName = countryComponent?.long_name || 'unknown';
  const city  = cityComponent?.long_name || 'unknown';
  log(`coords ${JSON.stringify(coords)} are in ${city}, ${countryFullName}`);
  return {...coords, city, country, countryFullName};
},

template: html`
  <style>
    :host {
      display: none !important;
    }
  </style>
  <geo-location on-coords="onCoords"></geo-location>
`

});
