export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({data, datum}, state, {isDirty}) {
  if (datum != null && isDirty("datum")) {
    if (!Array.isArray(data)) {
      data = [];
    }
    data.push(datum);
  }
  return {data};
}
});
