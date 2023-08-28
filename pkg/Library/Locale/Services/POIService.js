
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const otmUrl = 'https://api.opentripmap.com/0.1/en/places/';
const apiKey = globalThis?.config?.otherKeys?.OpenTripMap;

// For more info: https://opentripmap.io/examples
// Categories: https://opentripmap.io/catalog
export class POIService {
  static async fetch(url) {
    const response = await fetch(url, {credentials: 'omit'});
    if (response.status == 200) {
      return response.json();
    }
  }

  static async listPOIs(layer, atom, {latitude, longitude, radius, categories, offset, pageLength}) {
    const radiumInM = (radius??1) * 1000;
    // Note: if filtering by categories is needed, just fetching a thousand records. This can be improved later.
    const {include, exclude} = categories??{};
    const length = ((include?.length > 0 || exclude?.length > 0) ? 100 : pageLength)??100;
    const query = 
      `radius=${radiumInM}&limit=${length}&offset=${offset??0}&lon=${longitude}&lat=${latitude}&rate=2&format=json`;
    const url = `${otmUrl}radius?apikey=${apiKey}${query ? `&${query}` : ''}`;
    const results = await POIService.fetch(url);
    const filtered = results.filter(r => {
      const kinds = r.kinds.split(',');
      return kinds.some(kind => !include || include?.some(c => c === kind))
        && !kinds.some(kind => exclude?.some(c => c === kind));
    });
    return filtered.slice(0, pageLength);
  }

  static async getDetails(layer, atom, {xid}) {
    const url = `${otmUrl}xid/${xid}?apikey=${apiKey}`;
    const result = await POIService.fetch(url);
    return result;
  }
}
