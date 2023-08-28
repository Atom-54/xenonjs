export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

shouldRender({geolocation}) {
  return Boolean(geolocation);
},
render({geolocation: {latitude, longitude}, markers}) {
  return {latitude, longitude, markers};
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
