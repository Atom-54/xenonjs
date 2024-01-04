/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as LocalStorage from '../../LocalStorage/Services/LocalStorageService.js';
import * as FirebaseRealtime from '../../Firebase/Services/FirebaseRealtimeService.js';

const isFbKey = key => key.startsWith('(fb) ');
const getSimpleKey = key => isFbKey(key) ? key.slice(5) : key;

export const Storage = {
  getItem(key) {
    if (isFbKey(key)) {
      return FirebaseRealtime.getItem(getSimpleKey(key));
    }
    return LocalStorage.getItem(key);
  },
  setItem(key, value) {
    if (isFbKey(key)) {
      return FirebaseRealtime.setItem(getSimpleKey(key), value);
    }
    return LocalStorage.setItem(key, value);
  },
  newItem(key, name, data) {
    if (isFbKey(key)) {
      FirebaseRealtime.newItem(getSimpleKey(key), name, data);
    } else {
      LocalStorage.newItem(key, name, data);
    }
  },
  hasItem(key) {
    if (isFbKey(key)) {
      return FirebaseRealtime.hasItem(getSimpleKey(key));
    }
    return LocalStorage.hasItem(key);
  },
  removeItem(key) {
    if (isFbKey(key)) {
      return FirebaseRealtime.removeItem(getSimpleKey(key));
    }
    return LocalStorage.removeItem(key);
  },
  renameData(from, to) {
    if (isFbKey(from)) {
      return FirebaseRealtime.renameData(getSimpleKey(from), getSimpleKey(to));
    }
    return LocalStorage.renameData(from, to);
  },
  removeFolder(key) {
    if (isFbKey(key)) {
      return FirebaseRealtime.removeFolder(getSimpleKey(key));
    }
    return LocalStorage.removeFolder(key);
  }, 
  notifyFolderObservers(controller) {
    //if (isFbKey(key)) {
      //return 
      FirebaseRealtime.notifyFolderObservers(controller);
    //}
    return LocalStorage.notifyFolderObservers(controller);
  },
  async getFolders(storeId) {
    const entries = [
      await FirebaseRealtime.getFolders('FirebasePublic', 'Guest'),
      //await FirebaseRealtime.getFolders('FirebasePublic', storeId),
      LocalStorage.getFolders('LocalStorage', storeId)
    ];
    const root = [{
      name: 'root',
      hasEntries: true,
      entries
    }];
    //log.debug(root[0]);
    return root;
  },
  makeEntry(name, id, entries) {
    //const entries = LocalStorage.getFolders(storeId);
    return {name, id, entries, hasEntries: true};
  }
};
