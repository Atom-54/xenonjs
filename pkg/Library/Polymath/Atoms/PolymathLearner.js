export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {isDirty}) {
  isDirty('trigger');
},
async shouldUpdate({library, source}, state) {
  return library && source;
},
async update({library, source, trigger}, state, {service, isDirty}) {
  if (trigger && isDirty('trigger')) {
    return await service('PolymathService', 'Learn', {library, source});
  }
}
});
