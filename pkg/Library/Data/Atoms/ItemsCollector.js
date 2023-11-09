export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({data, datum}, state, {isDirty}) {
  if (datum && isDirty("datum")) {
    if (typeof datum === 'string') {
      try {
        datum = JSON.parse(datum);
      } catch(x) {
        log.warn('failed to parse datum as JSON', datum);
      }
    }
    if (!Array.isArray(data)) {
      data = [];
    }
    if (Array.isArray(datum)) {
      data.push(...datum);
    }
  }
  return {data};
}
});
