export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({source}, state, {isDirty}) {
  return source;
},
update({source, response}) {
  if (source && isDirty('source')) {
    state.results = [];
    state.index = 0;
  }
  if (state.results && response !== undefined && isDirty('response')) {
    state.results.push(response);
  }
  if (state.results) {
    if (state.results.length === state.index) {
      if (source.length > state.index) {
        return {data: source[state.index]}
      }
    }
  }
}
});
