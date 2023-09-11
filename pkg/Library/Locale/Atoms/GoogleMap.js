export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({geolocation}, state, {invalidate}) {
  if (geolocation) {
    state.geolocation = geolocation;
  }
  if (!state.geolocation) {
    timeout(() => {
      state.geolocation ??= {latitude: 48.8589384, longitude: 2.264635};
      invalidate();
    }, 200);
  }
},
shouldRender({}, state) {
  return Boolean(state.geolocation);
},
render({markers}, {geolocation: {latitude, longitude}}) {
  return {
    latitude: latitude??0,
    longitude: longitude??0,
    markers
  };
},
onMarkerClicked({eventlet: {key}}) {
  if (key) {
    return {marker: key};
  }
},
template: html`
<good-map flex zoom="12"
  latitude$="{{latitude}}"
  longitude$="{{longitude}}"
  markers="{{markers}}"
  on-marker-clicked="onMarkerClicked"></good-map>
`
});
