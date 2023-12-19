/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let observers = new Set();

const firebaseRealtimeDb = 'https://xenon-js-default-rtdb.firebaseio.com/v9/Guest/';

const firebaseRealtime = {
  async getItem(key) {
    const result = await fetch(`${firebaseRealtimeDb}${key}.json`);
    const pojo = await result?.json();
    console.warn(key, pojo);
  },
  async setItem(key, body) {
    /*const result =*/ await fetch(`${firebaseRealtimeDb}${key}.json`, {
      method: 'put',
      body
    });
  },
  // async removeItem(key, body) {
  // }
};

export class FirebaseRealtimeService {
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
  static async GetFolders(atom, {storeId}) {
    return getFolders(storeId);
  }
  static async ObserveFolders(atom) {
    observers.add(atom.id);
  }
}

export const notifyFolderObservers = controller => {
  for (const observer of observers) {
    controller.onevent(observer, {handler: 'onFoldersChange'});
  }
};

export const getItem = key => {
  const item = firebaseRealtime.getItem(key);
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

export const removeFolder = key => {
  const keys = getKeys(key);
  keys.forEach(key => firebaseRealtime.removeItem(key));
};

const getFolders = prefix => {
  const root = {entries: {}};
  const keys = getKeys(prefix);
  keys.sort();
  keys.forEach(key => eatKey(root, key.slice(prefix?.length || 0)));
  return [{
    name: 'root',
    hasEntries: true,
    entries: mapByName(prefix, root.entries)
  }];
};

const mapByName = (prefix, list) => Object.entries(list)
  .map(([key, value]) => makeFolderEntry(prefix, key, value))
  .sort(twoStageSort(byEntries, byName))
  ;

const makeFolderEntry = (prefix, key, {props, entries}) => {
  const hasEntries = !isEmpty(entries);
  const id = prefix + '/' + key;
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

const twoStageSort = (compareOne, compareTwo) => (a, b) => compareOne(a, b) || compareTwo(a, b);

const getKeys = prefix => {
  const keys = [];
  prefix = (prefix ?? '').replace('*', '');
  for (let i=0; i<firebaseRealtime.length;i++) {
    const key = firebaseRealtime.key(i);
    if (key.startsWith(prefix) || key.replace(/\./g, '/').startsWith(prefix.replace(/\./g, '/'))) {
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