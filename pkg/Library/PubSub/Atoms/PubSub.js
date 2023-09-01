export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  state.publish = async (path, value) => service('PubSubService', 'Publish', {path, value});
  state.subscribe = async path => service('PubSubService', 'Subscribe', {path});
},
update({path, publishValue}, state, {isDirty}) {
  if (path && isDirty('path')) {
    state.subscribe(path);
  }
  if (publishValue && publishValue !== "couldn't evaluate JSON" && isDirty('publishValue')) {
    state.publish(path, publishValue);
  }
},
onSubscribedValue({eventlet: {value}}) {
  return {subscribedValue: value};
}
});
    