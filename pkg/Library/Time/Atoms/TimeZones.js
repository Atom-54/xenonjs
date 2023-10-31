export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update(inputs, state) {
  if (!state.initialized) {
    state.initialized = true;
    return {
      timeZones: Intl.supportedValuesOf('timeZone'),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }
}

});
