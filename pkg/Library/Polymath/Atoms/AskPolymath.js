export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async shouldUpdate({library, query}, state) {
  return library && query;
},
async update({library, query}, state, {service, isDirty, output}) {
  if (isDirty('query')) {
    output({working: true, result: null, completion: ''});
    const result = await service('PolymathService', 'Ask', {library, query});
    const completion = result?.completion ?? '';
    return {query, result, completion, working: false};
  }
}
});
