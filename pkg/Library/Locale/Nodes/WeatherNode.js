/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const WeatherNode = {
  weather: {
    type: '$library/Locale/Atoms/Weather',
    inputs: ['geolocation'],
    outputs: ['weather']
  }
};
