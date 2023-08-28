/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {SSEPubSub} from '/.SSEPubSub.js';
import {onComposerEvent} from '../../CoreFramework/App.js';

const pubSub = new SSEPubSub();

export const SSEPubSubService = {
  async Publish(layer, atom, {path, value}) {
    console.warn('Publish', atom, path, value);
    return pubSub.publish(path, value);
  },
  async Subscribe(layer, atom, {path}) {
    console.warn('Subscribe', atom, path);
    const signal = (value) => {
      console.warn('Signal', atom, path, value);
      onComposerEvent(layer, atom, {subscribedValue: value});
    }
    return pubSub.subscribe(path, signal);
  }
};

