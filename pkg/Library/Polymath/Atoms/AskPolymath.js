export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async shouldUpdate({query}, state) {
  return query;
},
async update({query}, state, {service, isDirty}) {
  if (!isDirty('query')) {
    log.warn('query came again!')
    return;
  }
  const result = await service('PolymathService', 'Ask', {query});
  return {query, result, completion: result.completion};
}
});
