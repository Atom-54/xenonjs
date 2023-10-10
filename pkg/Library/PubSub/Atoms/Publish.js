export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  state.publish = async (path, value, auth) => service('PubSubService', 'Publish', {path, value, auth});
},
update({path, publishValue, auth}, state, {isDirty}) {
  if (path && auth && (publishValue !== undefined)) {
    if (!path.includes('null') && (publishValue !== "couldn't evaluate JSON")) {
      state.publish(path, publishValue, auth);
    }
  }
}
});
    