/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const log = logf('FirebaseRealtimeService', 'red');

let observers = new Set();

const firebaseRealtimeDb = 'https://xenon-js-default-rtdb.firebaseio.com/v9/Guest/';

// TODO(sjmiles): made this to parallel LocalStorage
const firebaseRealtime = {
  async getItem(key) {
    const result = await fetch(`${firebaseRealtimeDb}${key}.json`);
    const pojo = await result?.json();
    return pojo;
    //console.warn(key, pojo);
  },
  async setItem(key, body) {
    /*const result await*/ 
    return fetch(`${firebaseRealtimeDb}${key}.json`, {method: 'put', body});
  },
  async removeItem(key, body) {
    return fetch(`${firebaseRealtimeDb}${key}.json`, {method: 'delete'});
  },
  async getKeys(key) {
    //log.debug('reading subtree', key);
    const result = await fetch(`${firebaseRealtimeDb}${key}.json?shallow=true`);
    const pojo = await result?.json();
    return pojo && (typeof pojo === 'object') ? Object.keys(pojo) : [];
  }
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

export const newItem = async (key, name, data) => {
  //key = getFolderKey(key);
  const info = typeSlice(key);
  if (!info.type === 'folder') {
    info.path = getParentFolder(key);
    info.type = 'folder';
  }
  //
  //const uniqueKey = findUniqueKey(Storage, info.path + '/' + name);
  // 'name' must have type info
  const uniqueKey = info.path + '/' + name;
  //
  setItem(uniqueKey, data);
}

const typeSlice = key => {
  const chunks = key.split('(');
  const type = chunks.length > 1 ? chunks.pop().slice(0, -1) : 'folder';
  const path = chunks.join('(').trim();
  return {path, type};
};

const getParentFolder = key => {
  return key.split('/').slice(0, -1).join('/');
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
  firebaseRealtime.removeItem(key);
  // const keys = await firebaseRealtime.getKeys(key);
  // keys.forEach(key => firebaseRealtime.removeItem(key));
};

const iconsByType = {
  'graph': 'hub',
  'template': 'crossword',
  'atom': 'motion_photos_on'
};

export const getFolders = async prefix => {
  const makeEntries = async id => {
    const entries = [];
    const keys = await firebaseRealtime.getKeys(id);
    if (keys) {
      for (const key of keys) {
        // get last text in parens
        const chunks = key.split('(');
        const type = chunks.length > 1 ? chunks.pop().slice(0, -1) : 'folder';
        const name = key; //chunks.join('(');
        const localEntryId = id + '/' + key;
        const entry = {
          id: '(fb) ' + localEntryId,
          name, 
          type,
          icon: iconsByType[type] || 'widgets' 
        };
        if (type == 'folder') {
          entry.entries = await makeEntries(localEntryId);
          entry.hasEntries = true;
          //const subkeys = await firebaseRealtime.getKeys(prefix + '/' + key);
          //log.debug(entry);
        }
        entries.push(entry);
      }
    }
    return entries;
  };
  prefix = prefix.replaceAll('.', '/');
  const entries = await makeEntries(prefix);
  return {
    name: 'Firebase',
    id: 'firebase',
    hasEntries: true,
    entries
  };
  //return entries;
  // return {
  //   name: 'root',
  //   entries
  // };
  // const root = {
  //   entries: {
  //     Graphs: {
  //       entries: {
  //         empty: {}
  //       }
  //     }
  //   }
  // };
  // const keys = getKeys(prefix);
  // keys.sort();
  // keys.forEach(key => eatKey(root, key.slice(prefix?.length || 0)));
  // const entries = mapByName(prefix, root.entries);
  // return [{
  //   name: 'root',
  //   //hasEntries: true,
  //   entries
  // }];
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
const isEmpty = dictionary => Boolean(!dictionary || typeof dictionary !== 'object' || !Object.keys(dictionary).length);
const byName = (a, b) => (a.name === 'Deleted') ? 1 : (b.name === 'Deleted') ? -1 : a.name.localeCompare(b.name);
const byEntries = (a,b) => (a.hasEntries && !b.hasEntries) ? -1 : (!a.hasEntries && b.hasEntries) ? 1 : 0;