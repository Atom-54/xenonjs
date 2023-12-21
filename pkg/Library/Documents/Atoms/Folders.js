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
  return this.updateFolders({storeId}, state, {service});
},
async updateFolders({storeId}, state, {service}) {
  const folders = await service('DocumentService', 'GetFolders', {storeId});
  return {folders};
},
async onFoldersChange({storeId}, state, {service}) {
  return this.updateFolders({storeId}, state, {service});
},
});
    