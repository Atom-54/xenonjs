/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {init, revalidate} from './app.js';

// better than bad, it's good! it's log!
const log = logf('Main', 'indigo');
logf.flags.Main = true;

// formatter
const pretty = s => JSON.stringify(s, null, '  ');

export const main = async xenon => {
  // initialize app with Atom emitter
  const app = await init(xenon.emitter);
  binding(app.atoms);
  log('app is live 🌈');
  globalThis.app = app;
  // make a request
  const result = await requestPoetry(app);
  // dump the output
  document.body.innerHTML = result.markup;
  log('resolved\n', pretty(result));
};

// data for output
const info = {};

// data observation
const binding = ({AIClock$AIClock, AIClock$OpenAIText}) => {
  AIClock$AIClock.listen('output', ({displayTime, prompt}) => {
    info.prompt = prompt;
    info.displayTime = displayTime;
  }); 
  AIClock$OpenAIText.listen('output', ({result, markup}) => {
    if (!result.startsWith('a moment')) {
      info.poem = result;
      info.markup = markup;
      finalize(info);
    }
  });
};

// result handler
let finalize = info => {};

// watch for a an info dump
const getPoemPromise = () => {
  // promise is resolved by the graph or a timeout
  return new Promise(resolve => {
    finalize = info => resolve(info);
    // be sensitive to anti-stall logic on some platforms
    setTimeout(() => finalize('{"timeout": true}'), 20000);
  });
}

// fun
const contexts = [
  'Compose a haiku about the given subject.',
  'Compose a rhyming couplet, in iambic pentameter, about the given subject.',
  'Compose an amusing and pithy sentence, about the given subject.'
];
const moods = ['Joyful','Thoughtful','Pensive','Angry','Bored','Sad','Tired','Surprised','Sleepy','Enthralled','Calm','Relaxed','Restless','Satisfied','Shocked','Sick','Sympathetic','Cheerful','Blank','Blissful','Accepted','Ashamed','Amused','Envious','Loved','Lonely','Weird','Thankful','Grateful','Gloomy','Frustrated','Peaceful','Optimistic','Excited','Enraged','Energetic','Anxious','Annoyed','Content','Good','Drained','Disappointed','Determined','Curious','Crazy','Grumpy','Cranky','Confused','Cold','Rejected','Refreshed','Mad','Loved','Uncomfortable','Relieved','Rejuvenated','Numb','Giggly','Naughty','Mischievous','Hopeful','Happy','Lethargic','Lazy','Jealous','Irritated','Hyper','Bewildered','Tranquil','Exhausted'];

// set inputs, capture output
export const requestPoetry = async app => {
  // fun with mood
  const mood = moods[Math.floor(Math.random()*moods.length)].toLowerCase();
  app.atoms.AIClock$AIClock.inputs = {mood};
  // fun with context
  const context = contexts[Math.floor(Math.random()*contexts.length)];
  app.atoms.AIClock$OpenAIText.inputs = {context, restart: true};
  // include info for user
  Object.assign(info, {mood, context});
  // promise is resolved by the graph or a timeout
  const promise = getPoemPromise();
  // outside of a request, validation may be stalled (unstall it)
  revalidate(app);
  // waiting for results is next
  log('all set, obtained resolution promise');
  return promise;
};
