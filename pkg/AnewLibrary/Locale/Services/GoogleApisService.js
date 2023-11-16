/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const urls = {
  localNewsDataUrl: '',
  weatherDataUrl: '',
  mapsUrl: `https://maps.googleapis.com/maps/api/geocode/json?key=${globalThis?.config?.firebaseConfig?.apiKey}`
};

export class GoogleApisService {
  static async fetch(url) {
    const response = await fetch(url, {credentials: 'include'});
    if (response.status == 200) {
      const json = await response.json();
      console.log(json);
      return json;
    }
  }
  static async newsData(host, {country}) {
    return GoogleApisService.fetch(`${urls.localNewsDataUrl}${country}`);
  }
  static async weatherData(host, {data}) {
    const query = data ? `weather ${data}` : ``;
    return GoogleApisService.fetch(`${urls.weatherDataUrl}${query}`);
  }
  static async reverseCoords(host, {coords}) {
    if (coords?.latitude && coords?.longitude) {
      const query = `${urls.mapsUrl}&latlng=${coords.latitude},${coords.longitude}`;
      const response = await fetch(query);
      return response.json();
    }
  }
  static async coords(host, {address}) {
    if (address) {
      const query = `${urls.mapsUrl}&address=${address}`;
      const response = await fetch(query);
      return response.json();
    }
  }
  static async translate(host, {text, inLang, outLang}) {
    const response = await GoogleApisService.fetch(`${urls.translateUrl}?inlang=${inLang}&outlang=${outLang}&text=${text}`);
    return response.sentences?.map(s => s.trans)?.join('');
  }
}
