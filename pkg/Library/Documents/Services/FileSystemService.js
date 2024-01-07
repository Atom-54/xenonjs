/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as LocalStorage from '../../LocalStorage/Services/LocalStorageService.js';
import * as FirebaseRealtime from '../../Firebase/Services/FirebaseRealtimeService.js';

const log = globalThis.logf('FileSystemService', '#bbbbbb', 'darkorange');

export const FileSystemService = {
  async RegisterFileSystem(atom, {providerId, storeId, authToken}) {
    return registerFileSystem(atom, providerId, storeId || '(root)', storeId, authToken)
  },
  async ObserveFolders(atom) {
    return observeFolders(atom)
  },
  async GetFileSystemFolders(atom) {
    return {
      name: 'root', 
      hasEntries: true, 
      entries: await getAllFolders()
    };
  }
};

const providers = {};

providers[''] = LocalStorage;
providers['fb'] = FirebaseRealtime;

const observeFolders = atom => {
  Object.values(providers).forEach(
    provider => provider.observeFolders?.(atom.id)
  );
};

const fileSystems = {};

const registerFileSystem = (atom, providerId, name, storeId, authToken) => {
  fileSystems[atom.id] = {
    id: atom.id, 
    name, 
    providerId, 
    storeId, 
    authToken
  };
  FirebaseRealtime.notifyFolderObservers(atom.layer.controller);
};

const getAllFolders = async () => {
  const maps = await Promise.all(Object.values(fileSystems).map(
    async ({providerId, name, storeId, authToken}) => 
      getFolders(providerId, name, storeId, authToken)
  ));
  return maps;
};

const getFolders = async (providerId, name, storeId, authToken) => {
  const provider = providers[providerId];
  const folders = await provider?.getFolders(name, storeId, authToken);
  // observer-visitor pattern
  const pokeEntries = (folders, task) => folders.entries?.forEach(e => { 
    task(e);
    pokeEntries(e, task);
  });
  // assign file badges
  pokeEntries(folders, item => item.icon = 'app_badging');
  //log.warn(folders);
  return folders;
};

export const newItem = async (atom, key, content) => {
  const {fs, controller, provider, storePath, fileName} = parseFileInputs(atom, key);
  if (fs) {
    await provider?.newItem(storePath, fileName, content);
    provider?.notifyFolderObservers(controller);
  } else {
    log.warn('found no filesystem for key', key);
  }
};

export const getItem = async (atom, key) => {
  const {provider, fullPath} = parseFileInputs(atom, key);
  return await provider?.getItem(fullPath);
};

export const setItem = async (atom, key, content) => {
  const {controller, provider, fullPath} = parseFileInputs(atom, key);
  await provider?.setItem(fullPath, content);
  //provider?.notifyFolderObservers(controller);
};

export const removeFolder = async (atom, key) => {
  const {controller, provider, fullPath} = parseFileInputs(atom, key);
  await provider?.removeFolder(fullPath);
  provider?.notifyFolderObservers(controller);
};

export const renameItem = async (atom, key, name) => {
  const {controller, provider, fullPath, storePath} = parseFileInputs(atom, key);
  await provider?.renameItems(fullPath, storePath + '/' + name);
  provider?.notifyFolderObservers(controller);
  // const newKey = [...key.split('/').slice(0, -1), name].join('/');
  // storage.renameData(key, newKey);
  // storage.notifyFolderObservers(atom.layer.controller);
}

const parseFileInputs = (atom, key) => {
  const {controller} = atom?.layer || 0;
  const {providerId, path} = providerFromKey(key);
  const {root, filePath, fileName} = partsFromPath(path);
  const fs = Object.values(fileSystems).find(fs => fs.providerId === providerId && fs.name === root);
  const provider = providers[fs?.providerId];
  const storePath = [fs.storeId, filePath].filter(i=>i).join('/');
  const fullPath = [storePath, fileName].filter(i=>i).join('/');
  return {controller, fs, provider, storePath, fullPath, filePath, fileName};
}

export const providerFromKey = key => {
  let [providerId, path] = ['', key];
  if (key && key[0] === '(') {
    const _k = key.split(')');
    providerId = _k.shift().slice(1);
    path = _k.join(')').slice(1);
  }
  return {providerId, path};
};

export const partsFromPath = path => {
  let [root, filePath, fileName] = ['', '', '', ''];
  const p = path.split('/');
  root = p.shift();
  fileName = p.pop();
  filePath = p.join('/'); 
  return {root, filePath, fileName};
};
