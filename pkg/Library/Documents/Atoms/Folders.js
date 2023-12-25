export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({storeId}) {
  return Boolean(storeId) || storeId === '';
},
async update({storeId}, state, {service}) {
  service('LocalStorageService', 'ObserveFolders');
  service('FirebaseRealtimeService', 'ObserveFolders');
  return this.updateFolders({storeId}, state, {service});
},
async updateFolders({storeId}, state, {service}) {
  const folders = await service('DocumentService', 'GetFolders', {storeId});
  return {folders};
},
async onFoldersChange({storeId}, state, {service, output}) {
  const result = await this.updateFolders({storeId}, state, {service});
  output(result);
  //output(this.updateFolders({storeId}, state, {service}));
  //return this.updateFolders({storeId}, state, {service});
},
});
    