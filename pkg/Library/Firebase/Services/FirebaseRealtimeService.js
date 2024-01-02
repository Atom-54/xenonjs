/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const log = logf('FirebaseRealtimeService', 'pink');

const systems = {};
let observers = new Set();

export const FirebaseRealtimeService = class  {
  static async persist(atom, {storeId, data}) {
    if (storeId) {
      setItem(storeId, data);
    }
  }
  static async restore(atom, {storeId}) {
    if (!storeId.endsWith('*')) {
      return getItem(storeId);
    }
    return restoreAll(storeId);
  }
  static async GetFolders(atom, {name, storeId, authToken}) {
    return getFolders(name || storeId, storeId, authToken);
  }
  static async ObserveFolders(atom) {
    return observeFolders(atom.id);
  }
};

export const observeFolders = atomId => {
  observers.add(atomId);
};

export const notifyFolderObservers = async controller => {
  // TODO(sjmiles): workaround for missing change listener (see SSE)
  setTimeout(async () => {
    //await firebaseRealtime.init();
    for (const observer of observers) {
      controller.onevent(observer, {handler: 'onFoldersChange'});
    }
  }, 1000);
};

export const getFolders = async (name, path, authToken) => {
  // 'path' identifies a mini-filesystem
  const system = (systems[path] ??= new firebaseSystem(path, authToken));
  await system.getFolders();
  // get keys at `path`
  const entries = await getPathEntries(system);
  return {
    id: '(fb) ' + name,
    name,
    hasEntries: true,
    entries: mapByName(path, entries)
  };
};

const getPathEntries = async system => {
  const entries = {};
  const keys = await system.getKeys('');
  keys.sort().forEach(key => eatKey({entries}, key));
  return entries;
};

export const newItem = async (path, name, content, authToken) => {
  const systemId = Object.keys(systems).find(root => path.startsWith(root));
  if (systemId) {
    const localPath = path.slice(systemId.length);
    // this is all for potential renaming
    const typeInfo = typeSlice(name);
    const fullPath = (localPath ? localPath + '/' : '') + typeInfo.path;
    const typeName = typeInfo.type === 'folder' ? '' : ' (' + typeInfo.type + ')';
    let uniqueKey = fullPath + typeName;
    for (let i=0; hasItem(systemId, uniqueKey); i++) {
      uniqueKey = fullPath + ` ${i+1}` + typeName;
    }
    // set the actual data
    setItem(systemId, uniqueKey, content, authToken);
  }
};

export const setItem = (systemId, key, value, authToken) => {
  systems[systemId]?.setItem(key, JSON.stringify(value), authToken);
};

export const hasItem = (systemId, key) => {
  const system = systems[systemId];
  for (let i=0; i<system?.length; i++) {
    if (system.key(i) === key) {
      return true;
    }
  }
};

/* */

export const getItem = async key => {
  const item = await firebaseRealtime.getItem(key);
  try {
    return item ? JSON.parse(item) : null;
  } catch(x) {
    return item;
  }
};

export const removeItem = key => {
  firebaseRealtime.removeItem(key);
};

export const renameData = async (from, to) => {
  const keys = await getKeys(from);
  keys.forEach(key => 
    renameItem(key, to + key.slice(from.length))
  );
};

export const renameItem = async (from, to) => {
  const item = await firebaseRealtime.getItem(from);
  firebaseRealtime.setItem(to, item);
  firebaseRealtime.removeItem(from);
  log.debug('rename', from, ' => ', to);
};

const restoreAll = prefix => {
  const data = {};
  prefix = prefix.replace('*', '');
  for (let i=0; i<firebaseRealtime.length;i++) {
    const key = firebaseRealtime.key(i);
    if (key.startsWith(prefix)) {
      data[key] = getItem(key);
    }
  }
  return data;
};

export const removeFolder = async key => {
  const keys = await getKeys(key);
  keys.forEach(key => firebaseRealtime.removeItem(key));
};

const mapByName = (prefix, list) => Object.entries(list ?? 0)
  .map(([key, value]) => makeFolderEntry(prefix, key, value))
  .sort(twoStageSort(byEntries, byName))
  .map(entry => ({...entry, id: '(fb) ' + entry.id}))
  ;

const makeFolderEntry = (prefix, key, {props, entries}) => {
  const typeInfo = typeSlice(key);
  const hasEntries = !isEmpty(entries) || typeInfo.type === 'folder';
  const id = (prefix ? prefix + '/' : '') + key;
  const entry = { 
    ...props,
    name: key, 
    id,
    hasEntries
  };
  if (hasEntries) {
    entry.entries = mapByName(id, entries);
  }
  return entry;
};

const typeSlice = key => {
  const chunks = key.split('(');
  const type = chunks.length > 1 ? chunks.pop().slice(0, -1) : 'folder';
  const path = chunks.join('(').trim();
  return {path, type};
};

const twoStageSort = (compareOne, compareTwo) => (a, b) => compareOne(a, b) || compareTwo(a, b);

const getKeys = async prefix => {
  const keys = [];
  await firebaseReady;
  const nodots = key => key.replace(/\./g, '/');
  prefix = (prefix ?? '').replace('*', '');
  prefix = nodots(prefix);
  for (let i=0; i<firebaseRealtime.length;i++) {
    const key = firebaseRealtime.key(i);
    if (nodots(key).startsWith(prefix)) {
      keys.push(key);
    }
  }
  return keys;
};

const eatKey = (root, key) => {
  let entries = root.entries;
  const path = key
    .split('/') 
    .flatMap(part => part.split('.'))
    .flatMap(part => part.split('$'))
    ;
  const file = path.pop();
  if (file.includes('-bak')) {
    return;
  }
  while (path.length) {
    const name = path.shift();
    if (name) {
      const folder = entries[name] ??= {};
      entries = (folder.entries ??= {});
    }
  }
  entries[file] = {};
};

const firebaseSystem = class {
  constructor(root, authToken) {
    this.root = root;
    this.authToken = authToken;
  }
  async getFolders() {
    const url = this.getUrl(this.root, 'shallow=true');
    const result = await fetch(url);
    this.fileSystem = (await result?.json()) || {};
    //console.log(root, this.fileSystem);
    this.fsKeys = Object.keys(this.fileSystem).map(key => unbasinateKey(key));
    //console.log(this.fsKeys);
    this.length = this.fsKeys.length;
    return this;
  }
  getUrl(key, ...urlArgs) {
    const args = [this.authToken ? `auth=${this.authToken}` : '', ...(urlArgs||[])].filter(i=>i).join('&');
    return `${firebaseRealtimeDb}/${key}.json?${args}`;
  }
  key(index) {
    return this.fsKeys[index];
  }
  async getKeys() {
    return this.fsKeys;
  }
  setItem(key, content) {
    const body = JSON.stringify(content);
    const url = this.getUrl(this.root + '/' + basinateKey(key), 'shallow=true');
    return fetch(url, {method: 'put', body});
  }
};

const isEmpty = dictionary => Boolean(!dictionary || typeof dictionary !== 'object' || !Object.keys(dictionary).length);
const byName = (a, b) => (a.name === 'Deleted') ? 1 : (b.name === 'Deleted') ? -1 : a.name.localeCompare(b.name);
const byEntries = (a,b) => (a.hasEntries && !b.hasEntries) ? -1 : (!a.hasEntries && b.hasEntries) ? 1 : 0;

const firebaseRealtimeDb = 'https://xenon-js-default-rtdb.firebaseio.com/v9';

let fileSystem = {};
let fsKeys;

let ready;
const firebaseReady = new Promise(_ready => ready = _ready);

const firebaseRealtime = {
  length: 0,
  async init() {
    const result = await fetch(`${firebaseRealtimeDb}/Guest.json?shallow=true`);
    fileSystem = await result?.json();
    fsKeys = Object.keys(fileSystem).map(key => unbasinateKey(key));
    firebaseRealtime.length = fsKeys.length;
    //console.log(fsKeys, fileSystem);
    ready();
  },
  key(index) {
    return fsKeys[index];
  },
  async getItem(key) {
    await firebaseReady;
    const result = await fetch(`${firebaseRealtimeDb}/${basinateKey(key)}.json`);
    return result.json();
  },
  async setItem(key, value) {
    await firebaseReady;
    const body = JSON.stringify(value);
    return fetch(`${firebaseRealtimeDb}/${basinateKey(key)}.json`, {method: 'put', body});
  },
  async removeItem(key) {
    await firebaseReady;
    return fetch(`${firebaseRealtimeDb}/${basinateKey(key)}.json`, {method: 'delete'});
  },
  async renameItem(from, to) {
    const item = await firebaseRealtime.getItem(from);
    await firebaseRealtime.setItem(to, item);
    await firebaseRealtime.removeItem(from);
    log.debug('rename', from, ' => ', to);
  }
};

const basinateKey = key => key.replaceAll('/', '*');
const unbasinateKey = key => key.replaceAll('*', '/');

firebaseRealtime.init();
