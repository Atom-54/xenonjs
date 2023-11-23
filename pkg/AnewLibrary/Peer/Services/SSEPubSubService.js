/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as PubSub from './SSEPubSub.js';
import * as App from '../../CoreXenon/Framework/App.js';

const log = logf('Services:(SSE)PubSub', 'yellow', 'black');
//logf.flags['Services:(SSE)PubSub'] = true;

const defaultUrl = `${globalThis.config?.firebaseConfig?.databaseURL}/v1`;

let sources = {};
const requireSource = (url, auth) => sources[url] ??= PubSub.createSource(url, auth);

export const SSEPubSubService = {
  async Publish(layer, atom, {path, value, auth}) {
    if (!path || path.includes('null') || String(value) === 'undefined') {
      log('Publish: ignoring request containing null/undefined:', path, value);
    } else {
      log('Publishing', path, value);
      PubSub.publish(`${defaultUrl}${path}`, auth, value);
    }
  },
  async Subscribe(layer, atom, {path, auth}) {
    if (!path || path.includes('null')) {
      log('Subscribe: ignoring path containing null:', path);
    } else {
      log('Subscribe', path);
      const source = requireSource(`${defaultUrl}${path}`, auth);
      const signal = signalHandler(layer, atom, path);
      PubSub.subscribe(source, atom.name, signal);
    }
  },
  Unsubscribe(layer, atom, {path}) {
    if (!path || path.includes('null')) {
      log('Unsubscribe: ignoring path containing null:', path);
    } else {
      log('Unsubscribe', path);
      const source = requireSource(`${defaultUrl}${path}`);
      PubSub.unsubscribe(source, atom.name);
    }
  }
};

const signalHandler = (layer, atom, basePath) => 
  ({type, data, path}) => {
    log('Signal', basePath, type, path, data);
    const event =  {handler: 'onSubscribedValue', data: {value: data, basePath, path, type}};
    App.handleAtomEvent(layer, atom.name, event);
  };
