/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const log = logf('SSEPubSub', 'orange', 'black');
//logf.flags.SSEPubSub = true;

const composeJsonRequestUrl = (url, auth) => {
  return `${url}.json${auth ? `?auth=${auth}` : ''}`;
};

export const createSource = (url, auth) => {
  const requestUrl = composeJsonRequestUrl(url, auth);
  const source = new EventSource(requestUrl);
  source.listeners = {};
  source.addEventListener('put', e => onEvent(source, e));
  source.addEventListener('patch', e => onEvent(source, e));
  log('createSource:', requestUrl);
  return source;
};

const onEvent = (source, e) => {
  try {
    const info = JSON.parse(e.data);
    const packet = {type: e.type, data: info.data, path: info.path};
    notify(source, packet);
  } catch(x) {
    log.error(x);
  }
};

const notify = (source, packet) => {
  log('notify', packet);
  Object.values(source.listeners).forEach(l => l(packet));
  // const pathListeners = source.listeners[path];
  // if (pathListeners) {
  //   Object.values(pathListeners).forEach(l => l(packet));
  // }
};

export const subscribe = (source, id, signal) => {
  source.listeners[id] = signal;
  //const pathListeners = (source.listeners[path] ??= {});
  //pathListeners[id] = signal;
};

export const unsubscribe = (source, id) => {
  delete source.listeners[id];
  // const pathListeners = source.listeners[path];
  // if (pathListeners) {
  //   delete pathListeners[id];
  // }
};

export const publish = async (path, auth, value) => {
  const request = composeJsonRequestUrl(path, auth);
  const response = await fetch(request, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(value)
  });
  return response?.status;
};

