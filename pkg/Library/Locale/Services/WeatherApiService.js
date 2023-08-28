/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export class WeatherApiService {
  static async fetch(url) {
    const response = await fetch(url, {credentials: 'omit'});
    if (response.status == 200) {
      const json = await response.json();
      console.log(json);
      return json;
    }
  }
  static async weatherData(layer, atom, {latitude, longitude}) {
    const query = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,precipitation_probability_max&current_weather=true&timezone=auto&&forecast_days=7`;
    return WeatherApiService.fetch(query);
  }
}
