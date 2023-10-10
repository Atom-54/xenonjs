export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  const serviceName = 'PubSubService';
  state.publish = async (path, auth, value) => service(serviceName, 'Publish', {path, auth, value});
  state.subscribe = async (path, auth) => service(serviceName, 'Subscribe', {path, auth});
  state.unsubscribe = async (path, auth) => service(serviceName, 'Unsubscribe', {path, auth});
},
update({path, publishValue, auth}, state, {isDirty}) {
  if (path && auth) {
    if (!path.includes('null')) {
      if (state.lastPath !== path) {
        if (state.lastPath) {
          state.unsubscribe(state.lastPath);
        }
        state.lastPath = path;
        state.subscribe(path, auth);
      }
      if ((publishValue !== undefined) && (publishValue !== "couldn't evaluate JSON") && isDirty('publishValue')) {
        state.publish(path, auth, publishValue);
      }
    }
  }
},
onSubscribedValue({eventlet: {basePath, path, value}}, state) {
  if (path === '/') {
    state.value = value;
  } else {
    const keys = path.split('/');
    let obj = state.value;
    if (typeof obj === 'object') {
      const lastKey = keys.pop();
      for (let key; (key = keys.shift()); obj = obj[key]);
      obj[lastKey] = value;
    }
  }
  log('onSubscribedValue', basePath, path, state.value);
  return {subscribedValue: deepCopy(state.value)};
}
});
    