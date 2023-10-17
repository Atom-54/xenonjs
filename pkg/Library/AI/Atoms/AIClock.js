export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({mood, text}, state, {output, invalidate}) {
  // process relevant input text
  if (text && !text?.startsWith('a moment')) {
    state.text = text.replace(/^["'`]*/, '').replace(/["'`]*$/, '').trim();
  }
  if (!state.waiting) {
    // time stuff
    const minute = 60 * 1000;
    const duration = 30;
    // when are we?
    const now = new Date();
    // how far into the hour is that?
    const minutes = now.getMinutes();
    // go again in the next quantum (or so)
    state.waiting = true;
    const wait = duration - (minutes % duration);
    timeout(() => {
      state.waiting = false;
      invalidate()
    }, wait * minute);
    log('will update again in', wait, 'minutes');
    // rounding
    const aiMinutes = minutes < 30 ? '00' : '30';
    // formatting
    const chime = new Date();
    chime.setHours(now.getHours());
    chime.setMinutes(aiMinutes);
    const displayTime = chime.toLocaleTimeString(undefined, {hour: "numeric", minute: "numeric"});
    const prompt = `${mood ? `The mood is ${mood}. ` : ''}Time is ${displayTime}.`;
    state.displayTime = displayTime;
    return {displayTime, mood, prompt};
  }
},
// shouldRender({}, {text}) {
//   return Boolean(text);
// },
render({image}, {displayTime, text}) {
  return {image, displayTime, text};
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
`
});
  