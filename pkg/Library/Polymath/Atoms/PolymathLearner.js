export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async shouldUpdate({library, source}, state) {
  return library && source;
},
async update({library, source}, state, {service, isDirty}) {
  return await service('PolymathService', 'Learn', {library, source});
}
});
