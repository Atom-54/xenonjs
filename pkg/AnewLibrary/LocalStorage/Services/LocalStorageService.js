/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export class LocalStorageService {
  static async persist(atom, {storeId, data}) {
    if (storeId) {
      localStorage.setItem(storeId, JSON.stringify(data));
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
  static async OpenAsset(atom, data) {
    console.warn(data);
  }
}

const getItem = key => {
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : null;
  } catch(x) {
    return item;
  }
};

const restoreAll = prefix => {
  const data = {};
  prefix = prefix.replace('*', '');
  for (let i=0; i<localStorage.length;i++) {
    const key = localStorage.key(i);
    if (key.startsWith(prefix)) {
      data[key] = getItem(key);
    }
  }
  return data;
};

const getFolders = prefix => {
  const root = {entries: {}};
  const keys = getKeys(prefix);
  keys.forEach(key => eatKey(root, key.slice(prefix.length)));
  const mapByName = list => 
    Object.entries(list)
    .map(([key, value]) => getFolderEntry(mapByName, key, value))
    .sort(twoStageSort(byEntries, byName))
  ;
  return [{
    name: 'root',
    hasEntries: true,
    entries: mapByName(root.entries)
  }];
};

const getFolderEntry = (mapByName, key, {props, entries}) => {
  const hasEntries = !isEmpty(entries);
  const entry = { 
    ...props,
    name: key, 
    hasEntries
  };
  if (hasEntries) {
    //entry.closed = Math.random() < 0.25;
    entry.entries = mapByName(entries);
  }
  return entry;
};

const twoStageSort = (compareOne, compareTwo) => (a, b) => compareOne(a, b) || compareTwo(a, b);

const getKeys = prefix => {
  const keys = [];
  prefix = prefix.replace('*', '');
  for (let i=0; i<localStorage.length;i++) {
    const key = localStorage.key(i);
    if (key.startsWith(prefix)) {
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
const byName = (a,b) => a.name.localeCompare(b.name);
const byEntries = (a,b) => (a.hasEntries && !b.hasEntries) ? -1 : (!a.hasEntries && b.hasEntries) ? 1 : 0;