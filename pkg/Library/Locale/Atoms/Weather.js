export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

async update({geolocation}, state, {service, isDirty}) {
  const latitude = geolocation?.latitude?.toFixed(2);
  const longitude = geolocation?.longitude?.toFixed(2);
  if (latitude && longitude && isDirty('geolocation')) {
    const weather = await service('WeatherApiService', 'weatherData', geolocation);
    log(weather);
    state.weather = weather;
    return {weather};
  }
},

render(inputs, {weather}) {
  if (weather) {
    return {
      daily: this.renderDaily(weather.daily)
    };
  }
},

renderDaily(daily) {
  const {time, temperature_2m_max, temperature_2m_min, precipitation_sum, precipitation_probability_max} = daily;
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // const format = t => new Date(new Date(t).getTime() + offset).toLocaleString('en-us', {month: 'short' , day: 'numeric'});
  return time.map((t, index) => {
    const date = new Date(new Date(t).getTime() + offset);
    const icon = precipitation_probability_max[index] < 30 
          ? 'clear_day'
          : precipitation_probability_max[index] < 60
              ? 'partly_cloudy_day' : 'rainy';
    return {
      date: index === 0 ? 'Today' : date.toLocaleString('en-us', {month: 'short' , day: 'numeric'}),
      day: days?.[date.getDay()],
      max: Math.round(temperature_2m_max[index]),
      min: Math.round(temperature_2m_min[index]),
      precipitation: precipitation_sum[index],
      icon,
      style: icon
    };
  });
},

template: html`
<style>
:host {
  overflow: auto !important;
}
icon {
  font-size: 2em;
  border-radius: 25px;
  padding: 10px;
}
[weather] {
  border: 1px solid var(--xcolor-three);
  border-radius: 20px;
  line-height: 1.5em;
  margin: 5px;
  padding: 15px;
  text-align: center;
}
[day] {
  white-space: nowrap;
}
[date] {
  color: 1px solid var(--xcolor-three);
  white-space: nowrap;
  font-size: 0.8em;
}
[temperature] {
  font-size: 0.8em;
}
.clear_day {
  background-color: deepskyblue;
  color: yellow;
}
.partly_cloudy_day {
  background-color: lightblue;
  color: white;
}
.rainy {
  background-color: lightgrey;
  color: grey;
}
</style>

<div flex columns>
  <div flex></div>
  <div columns repeat="daily_t" style="overflow: auto !important">{{daily}}</div>
  <div flex></div>
</div>

<template daily_t>
  <div weather>
    <div day>{{day}}</div>
    <div date>{{date}}</div>
    <icon class="{{style}}">{{icon}}</icon>
    <div columns temperature>
      <div flex></div><div>{{min}}</div>°-<div>{{max}}</div>°<div flex></div>
    </div>
  </div>
</template>


`
});
