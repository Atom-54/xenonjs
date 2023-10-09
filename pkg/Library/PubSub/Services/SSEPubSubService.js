/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as PubSub from './SSEPubSub.js';
import * as App from '../../CoreXenon/Framework/App.js';

const log = logf('Services:(SSE)PubSub', 'yellow', 'black');
logf.flags['Services:(SSE)PubSub'] = true;

let source;
const defaultUrl = `${globalThis.config?.firebaseConfig?.databaseURL}/v1/shared`;

const requireSource = (auth) => source ??= PubSub.createSource(defaultUrl, auth);

export const SSEPubSubService = {
  async Publish(layer, atom, {path, value, auth}) {
    log('Publish', path, value);
    if (!path || path.includes('null') || String(value) === 'undefined') {
      log('ignoring request containing null/undefined:', path, value);
      return;
    }
    PubSub.publish(`${defaultUrl}${path}`, auth, value);
  },
  async Subscribe(layer, atom, {path, auth}) {
    log('Subscribe', path);
    if (!path || path.includes('null')) {
      log('ignoring path containing null:', path);
      return;
    }
    const source = requireSource(auth);
    const signal = signalHandler(layer, atom, path);
    PubSub.subscribe(source, path, atom.name, signal);
  },
  Unsubscribe(layer, atom, {path}) {
    log('Unsubscribe', path);
    if (source) {
      PubSub.unsubscribe(source, path, atom.name);
    }
  }
};

const signalHandler = (layer, atom, path) => 
  ({type, data}) => {
    log('Signal', path, type, data);
    const event =  {handler: 'onSubscribedValue', data: {value: data}};
    App.handleAtomEvent(layer, atom.name, event);
  };
