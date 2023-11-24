export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async shouldUpdate({name}, state) {
  return name;
},
async update({name}, state, {service, isDirty}) {
  const {id} = await service('PolymathService', 'RegisterLibrary', {name})
  state.id = id || state.id;
  return {library: state.id};
}
});
