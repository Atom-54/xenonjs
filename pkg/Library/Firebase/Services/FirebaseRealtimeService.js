/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const log = logf('FirebaseRealtimeService', 'pink');

let observers = new Set();

export class FirebaseRealtimeService {
  // static async persist(atom, {storeId, data}) {
  //   if (storeId) {
  //     setItem(storeId, data);
  //   }
  // }
  // static async restore(atom, {storeId}) {
  //   if (!storeId.endsWith('*')) {
  //     return getItem(storeId);
  //   }
  //   return restoreAll(storeId);
  // }
  static async GetFolders(atom, {storeId}) {
    return getFolders(storeId);
  }
  static async ObserveFolders(atom) {
    observers.add(atom.id);
  }
}

export const notifyFolderObservers = async controller => {
  setTimeout(async () => {
    await firebaseRealtime.init();
    for (const observer of observers) {
      controller.onevent(observer, {handler: 'onFoldersChange'});
    }
  }, 1000);
};

export const newItem = async (key, name, data) => {
  // 'name' must have type info
  const typeInfo = typeSlice(name);
  const type = typeInfo.type === 'folder' ? '' : ' (' + typeInfo.type + ')';
  let fullKey = (key ? key + '/' : '') + typeInfo.path;
  let uniqueKey = fullKey + type;
  for (let i=0; hasItem(uniqueKey); i++) {
    uniqueKey = fullKey + ` ${i+1}` + type;
  }
  setItem(uniqueKey, data);
};

export const getItem = async key => {
  const item = await firebaseRealtime.getItem(key);
  try {
    return item ? JSON.parse(item) : null;
  } catch(x) {
    return item;
  }
};

export const setItem = (key, value) => {
  firebaseRealtime.setItem(key, JSON.stringify(value));
};

export const removeItem = key => {
  firebaseRealtime.removeItem(key);
};

export const hasItem = key => {
  for (let i=0; i<firebaseRealtime.length; i++) {
    if (firebaseRealtime.key(i) === key) {
      return true;
    }
  }
};

export const renameItem = async (from, to) => {
  const keys = await getKeys(from);
  keys.forEach(key => firebaseRealtime.renameItem(key, to + key.slice(from.length)));
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

export const getFolders = async prefix => {
  const root = {entries: {}};
  //prefix = '(fb) ' + (prefix || '');
  prefix = (prefix ? '/' + prefix : '');
  const keys = await getKeys(prefix);
  keys.sort();
  keys.forEach(key => eatKey(root, key.slice(prefix?.length || 0)));
  return {
    name: 'FirebaseRealtime',
    id: '(fb) ',
    hasEntries: true,
    entries: mapByName(prefix, root.entries)
  };
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
    //entry.closed = Math.random() < 0.25;
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

const isEmpty = dictionary => Boolean(!dictionary || typeof dictionary !== 'object' || !Object.keys(dictionary).length);
const byName = (a, b) => (a.name === 'Deleted') ? 1 : (b.name === 'Deleted') ? -1 : a.name.localeCompare(b.name);
const byEntries = (a,b) => (a.hasEntries && !b.hasEntries) ? -1 : (!a.hasEntries && b.hasEntries) ? 1 : 0;

const firebaseRealtimeDb = 'https://xenon-js-default-rtdb.firebaseio.com/v9/Guest/';

let fileSystem = {};
let fsKeys;

let ready;
const firebaseReady = new Promise(_ready => ready = _ready);

const firebaseRealtime = {
  length: 0,
  async init() {
    const result = await fetch(`${firebaseRealtimeDb}.json?shallow=true`);
    fileSystem = await result?.json();
    fsKeys = Object.keys(fileSystem).map(key => unbasinateKey(key));
    firebaseRealtime.length = fsKeys.length;
    console.log(fsKeys, fileSystem);
    ready();
  },
  key(index) {
    return fsKeys[index];
  },
  async getItem(key) {
    await firebaseReady;
    const result = await fetch(`${firebaseRealtimeDb}${basinateKey(key)}.json`);
    return result.json();
  },
  async setItem(key, value) {
    await firebaseReady;
    const body = JSON.stringify(value);
    return fetch(`${firebaseRealtimeDb}${basinateKey(key)}.json`, {method: 'put', body});
  },
  async removeItem(key) {
    await firebaseReady;
    return fetch(`${firebaseRealtimeDb}${basinateKey(key)}.json`, {method: 'delete'});
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
