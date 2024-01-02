export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update(inputs, state, {service}) {
  service('FileSystemService', 'ObserveFolders', inputs);
  state.getAllFolders = async ({}) => ({folders: [
    await service('FileSystemService', 'GetFileSystemFolders', {})
  ]});
  return state.getAllFolders(inputs);
},
async onFoldersChange(inputs, state, {output}) {
  const data = await state.getAllFolders(inputs);
  // TODO(sjmiles): using output as a workaround because `return` value
  // is not propertly supported by service-provoked events
  output(data);
}
});
    