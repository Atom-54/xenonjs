export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
//
shouldUpdate({key}) {
  return key;
},
async update({key, storeValue}, state, {service}) {
  const bind = method => data => service('LocalStorageService', method, data);
  const [restore, persist] = [bind('restore'), bind('persist')];
  const cached = await restore({storeId: key});
  if (cached !== undefined && (state.value === undefined || state.key !== key)) {
    state.key = key;
    state.value = cached;
    return {value: state.value};
  } else if (!deepEqual(state.value, storeValue)) {
    log('about to persist', key, storeValue);
    state.value = storeValue;
    await persist({storeId: key, data: storeValue});
    // stochastic backups
    if (cached !== undefined) {
      persist({storeId: `${key}-bak`, data: cached});
      if (Math.random() < 0.1) {
        persist({storeId: `${key}-bak1`, data: cached});
        if (Math.random() < 0.1) {
          persist({storeId: `${key}-bak2`, data: cached});
        }
      }
    }
  }
}
});