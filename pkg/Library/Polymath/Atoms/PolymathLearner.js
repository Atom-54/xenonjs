export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {isDirty}) {
  isDirty('trigger');
},
async shouldUpdate({library, type, source, content, trigger}, state, {isDirty}) {
  return library && source && content && trigger && isDirty('trigger');
},
async update({library, type, source, content}, state, {service, output}) {
  output({ok: null, learning: true});
  const ok = await service('PolymathService', 'Learn', {library, type, source, content});
  return {
    ok,
    learning: false
  };
}
});
