/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as PubSub from './SSEPubSub.js';
import * as App from '../../CoreXenon/Framework/App.js';

const log = logf('Services:(SSE)PubSub', 'yellow', 'black');
logf.flags['Services:(SSE)PubSub'] = true;

const defaultUrl = globalThis.config?.firebaseConfig?.databaseURL;

const maybeDefaultPath = path => {
  return path.startsWith('https') ? path : `${defaultUrl}/${path}`;
};

export const SSEPubSubService = {
  async Publish(layer, atom, {path, value, auth}) {
    log('Publish', path, value);
    if (!path || path.includes('null')) {
      log('ignoring path with null:', path);
      return;
    }
    if (path) {
      PubSub.publish(maybeDefaultPath(path), auth, value);
    }
  },
  async Subscribe(layer, atom, {path, auth}) {
    log('Subscribe', path);
    if (!path || path.includes('null')) {
      log('ignoring path with null:', path);
      return;
    }
    const signal = ({type, data}) => {
      log('Signal', path, type, data);
      const event =  {handler: 'onSubscribedValue', data: {value: data}};
      App.handleAtomEvent(layer, atom.name, event);
    };
    PubSub.subscribe(atom.name, signal, maybeDefaultPath(path), auth);
  },
  Unsubscribe(layer, atom, {path}) {
    log('Unsubscribe', path);
    PubSub.unsubscribe(atom.name, maybeDefaultPath(path));
  }
};
