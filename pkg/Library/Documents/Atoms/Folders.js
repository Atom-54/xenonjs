export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({storeId, userId}, state, {service}) {
  service('LocalStorageService', 'ObserveFolders');
  service('FirebaseRealtimeService', 'ObserveFolders');
  return await this.updateFolders(service, storeId, userId);
},
async onFoldersChange({storeId, userId}, state, {service, output}) {
  output(await this.updateFolders(service, storeId, userId));
},
async updateFolders(service, storeId, userId) {
  return service('DocumentService', 'GetFolders', {storeId, userId});
}
});
    