/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// import * as Controller from '../../Framework/Controller.js';
// import {Storage} from './Storage.js';
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
  // async GetFolders(atom, {name, providerId, storeId, authToken}) {
  //   return getFolders(providerId, name || storeId, storeId, authToken);
  // },
  async GetFileSystemFolders(atom) {
    return {name: 'root', hasEntries: true, entries: await getAllFolders()};
  }
//   static async Open(atom, data) {
//     log.debug('Open', data, atom.id);
//     openDocument(atom, data);
//   }
//   static async NewFolder(atom, data) {
//     log.debug('NewFolder', data, atom.id);
//     newFolder(atom, data);
//   }
//   static async NewDocument(atom, data) {
//     log.debug('NewDocument', data, atom.id);
//     newDocument(atom, data);
//   }
//   static async Close(atom, data) {
//     log.debug('Close', data);
//     closeDocument(data.label);
//   }
//   static async Save(atom, {document, content}) {
//     //log.debug('Save', {document, content});
//     saveDocument(atom.layer.controller, document, content);
//   }
//   static async Copy(atom, data) {
//     log.debug('Copy', data);
//     copyData(atom, data);
//   }
//   static async Paste(atom, data) {
//     log.debug('Paste', data);
//     pasteData(atom, data);
//   }
//   static async Rename(atom, {key, value}) {
//     log.debug('Rename', key, value);
//     renameData(atom, key, value);
//   }
//   static async Delete(atom, id) {
//     log.debug('Delete', id);
//     const name = id.split('/').pop();
//     const ok = window.confirm(`Delete "${name}"?`);
//     if (ok) {
//       return deleteData(atom, id);
//     }
//   }
};

const providers = {};

providers[''] = LocalStorage;
providers['fb'] = FirebaseRealtime;

const observeFolders = atom => {
  Object.values(providers).forEach(
    provider => provider.observeFolders?.(atom.id)
  );
  // const provider = providers[providerId];
  // provider?.observeFolders(atom.id);
};

const fileSystems = {};

const registerFileSystem = (atom, providerId, name, storeId, authToken) => {
  fileSystems[atom.id] = {id: atom.id, name, providerId, storeId, authToken};
  FirebaseRealtime.notifyFolderObservers(atom.layer.controller);
};

const getAllFolders = async () => {
  const maps = await Promise.all(Object.values(fileSystems).map(
    async ({providerId, name, storeId, authToken}) => getFolders(providerId, name, storeId, authToken)
  ));
  return maps;
};

const getFolders = (providerId, name, storeId, authToken) => {
  const provider = providers[providerId];
  return provider?.getFolders(name, storeId, authToken);
};

const parseFileInputs = (atom, key) => {
  const {controller} = atom.layer;
  const {providerId, path} = providerFromKey(key);
  const {root, filePath, fileName} = partsFromPath(path);
  const fs = Object.values(fileSystems).find(fs => fs.providerId === providerId && fs.name === root);
  const provider = providers[fs?.providerId];
  const storePath = [fs.storeId, filePath].filter(i=>i).join('/');
  const fullPath = [storePath, fileName].filter(i=>i).join('/');
  return {controller, fs, provider, storePath, fullPath, filePath, fileName};
}

export const newItem = async (atom, key, content) => {
  const {controller, fs, provider, storePath, fileName} = parseFileInputs(atom, key);
  if (fs) {
    //log.warn(provider, storePath, fileName, storePath);
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
