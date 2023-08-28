export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialization(inputs, state, {service}) {
  state.publish = async value => service('PubSubService', 'Publish', {path, value});
  state.subscribe = async value => service('PubSubService', 'Subscribe', {path});
},
update({path, publishValue}, state, {isDirty}) {
  if (isDirty(path)) {
    state.subscribe(path);
  }
  if (isDirty(publishValue)) {
    state.publish(path, publishValue);
  }
},
onSubscribedValue({eventlet: {subscribedValue}}) {
  return {subscribedValue};
}
});
    