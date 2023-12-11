export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  shouldUpdate({storeId}) {
    return Boolean(storeId);
  },
  async update({storeId}, state, {service}) {
    service('LocalStorageService', 'ObserveFolders');
    return this.udpateFolders({storeId}, state, {service});
  },
  async udpateFolders({storeId}, state, {service}) {
    const folders = await service('LocalStorageService', 'GetFolders', {storeId});
    return {folders};
  },
  async onFoldersChange({storeId}, state, {service}) {
    return this.udpateFolders({storeId}, state, {service});
  },
});
    