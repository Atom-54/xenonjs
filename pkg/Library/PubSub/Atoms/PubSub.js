export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  const serviceName = 'PubSubService';
  state.publish = async (path, value, auth) => service(serviceName, 'Publish', {path, value, auth});
  state.subscribe = async (path, auth) => service(serviceName, 'Subscribe', {path, auth});
  state.unsubscribe = async (path, auth) => service(serviceName, 'Unsubscribe', {path, auth});
},
update({path, publishValue, auth}, state, {isDirty}) {
  if (path && auth && (isDirty('path') || isDirty('auth'))) {
    if (state.lastPath !== path) {
      state.unsubscribe(path);
      state.lastPath = path;
    }
    state.subscribe(path, auth);
  }
  if (publishValue && publishValue !== "couldn't evaluate JSON" && isDirty('publishValue')) {
    state.publish(path, publishValue, auth);
  }
},
onSubscribedValue({eventlet: {value}}) {
  return {subscribedValue: value};
}
});
    