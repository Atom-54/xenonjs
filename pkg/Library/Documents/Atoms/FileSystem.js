export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update(inputs, state, {service}) {
  //if (storeId) {
    service('FileSystemService', 'RegisterFileSystem', inputs);
    //service('FileSystemService', 'ObserveFolders', inputs);
    // state.getFolders = async ({providerId, storeId, authToken}) => ({
    //   folders: [await service('FileSystemService', 'GetFolders', {providerId, storeId, authToken})]
    // });
    // return state.getFolders(inputs);
  //}
  //state.getFolders = () => ({folders: {}});
},
// async onFoldersChange(inputs, state, {service, output}) {
//   // TODO(sjmiles): using output as a workaround because `return` value
//   // is not propertly supported by service-provoked events
//   output(state.getFolders(inputs));
// }
});
    