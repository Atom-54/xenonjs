export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({mood, text}, state, {output, invalidate}) {
  // process relevant input text
  if (!text?.startsWith('a moment')) {
    // text = (text ?? '').replace(/\n/g, '').replace(/,/g, ',\n').replace(/;/g, ';\n').replace(/\.\s*/g, '.\n').replace(/\!\s/g, '!\n');
    // if (text.startsWith('"') && text.endsWith('"')) {
    //   text = text.slice(1, -1);
    // }
    state.text = text;
  }
  // time stuff
  const minute = 60 * 1000;
  const hour = 60 * minute;
  // when are we?
  const now = new Date();
  // how far into the hour are we?
  const minutes = now.getMinutes();
  // go again in the next quantum (or so)
  timeout(invalidate, hour - minutes); 
  // once an hour for now
  const marker = now.getHours();
  if (marker !== state.marker || mood !== state.mood) {
    // // truncate to hour
    // now.setMilliseconds(0);
    // now.setSeconds(0);
    // now.setMinutes(0);
    const aiTime = now.toLocaleTimeString(undefined, {hour: "numeric"});
    const prompt = `${mood ? `The mood is ${mood}. ` : ''}Time is ${aiTime}.`;
    const displayTime = aiTime;
    state.mood = mood;
    state.marker = marker;
    state.displayTime = displayTime;
    return {displayTime, mood, prompt};
  }
},
template: html`
<style>
  image-resource {
    border-radius: 50%;
    height: 256px;
    width: 256px;
  }
  [time] {
    font-family: sans-serif;
    letter-spacing: -2px;
    font-weight: 900;
    font-size: 320%;
    -webkit-text-stroke: 2px var(--xcolor-one);
    transform: translateY(-160px);
  }
  [words] {
    white-space: pre-wrap; 
    font-size: 120%;
    min-height: 100px;
    margin-top: -40px;
  }
</style>
<div flex center column>
  <image-resource image="{{image}}"></image-resource>
  <div time>{{displayTime}}</div>
  <div words>{{text}}</div>
</div>
<!-- <multi-select select key="{{key}}" on-change="onMoodChange" options="{{options}}"></multi-select> -->
`
});
  