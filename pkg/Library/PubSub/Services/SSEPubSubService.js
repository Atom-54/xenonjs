/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {SSEPubSub} from './SSEPubSub.js';
import {onComposerEvent} from '../../CoreFramework/App.js';

const log = logf('Services:(SSE)PubSub', 'yellow', 'black');
//const pubSub = new SSEPubSub(`${globalThis.config?.firebaseConfig?.databaseURL}/pubsub`);

// TODO(sjmiles): SSEPubSub should handle the multiplexing
const pubsubs = [];
const getPubSub = path => pubsubs[path] ??= new SSEPubSub(`${globalThis.config?.firebaseConfig?.databaseURL}/pubsub/${path}`);

export const SSEPubSubService = {
  async Publish(layer, atom, {path, value}) {
    log('Publish', path, value);
    return getPubSub(path).publish(path, value);
  },
  async Subscribe(layer, atom, {path}) {
    log('Subscribe', path);
    const signal = (value) => {
      log('Signal', path, value);
      const event =  {handler: 'onSubscribedValue', data: {value}};
      onComposerEvent(layer, atom.name, event);
    };
    return getPubSub(path).subscribe(path, signal);
  }
};

