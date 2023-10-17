export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async shouldUpdate({library, query, enabled}, state) {
  return library && query && enabled;
},
async update({library, query, trigger}, state, {service, isDirty, output}) {
  if (isDirty('trigger')) {
    output({working: true, result: null, completion: ''});
    const result = await service('PolymathService', 'Ask', {library, query});
    const completion = result?.completion ?? '';
    return {query, result, completion, working: false};
  }
}
});
