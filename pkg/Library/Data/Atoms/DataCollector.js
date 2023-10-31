export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({data, datum}, state, {isDirty}) {
  if (datum && isDirty("datum")) {
    if (!Array.isArray(data)) {
      data = [];
    }
    data.push(datum);
  }
  return {data};
}
});
