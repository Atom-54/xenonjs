export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({source}) {
  return source;
},
update({source, stride, response}, state, {isDirty}) {
  stride = Number(stride) || 1;
  if (source && isDirty('source')) {
    state.results = [];
    state.index = 0;
  }
  const gotResponse = (response != null) && isDirty('response');
  if (gotResponse && state.index > 0) {
    log('gotResponse', state.index, response)
    if (response.length) {
      state.results.push(...response);
    } else {
      state.results.push(response);
    }
  }
  const output = {};
  if (state.results.length) {
    log('current results', state.results)
    output.results = [...state.results];
  }
  if (gotResponse || state.index === 0) {
    if (source.length > state.index) {
      const start = state.index;
      state.index = Math.min(source.length, state.index+stride);
      const data = source.slice(start, state.index);
      output.data = data;
      log('sending data', state.index, data);
    } else {
      //log('output results:', state.results);
    }
    return output;
  }
}
});
