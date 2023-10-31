export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

async update({timeZone, timeOptions, precision}, state, {invalidate}) {
  const now = new Date();
  if (precision > 0) {
    timeout(invalidate, Math.max(1000, precision));
  }
  state.time = now.toLocaleTimeString(undefined, {...timeOptions, timeZone});
  return {time: state.time};
}

});
