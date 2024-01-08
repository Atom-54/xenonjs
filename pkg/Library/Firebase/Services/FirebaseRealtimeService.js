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

export const newItem = async (path, name, content) => {
  const systemId = Object.keys(systems).find(root => path.startsWith(root));
  if (systemId) {
    const localPath = path.slice(systemId.length);
    // this is all for potential renaming
    const typeInfo = typeSlice(name);
    const fullPath = (localPath ? localPath + '/' : '') + typeInfo.path;
    const typeName = typeInfo.type === 'folder' ? '' : ' (' + typeInfo.type + ')';
    let uniqueKey = fullPath + typeName;
    for (let i=0; systemHasItem(systemId, uniqueKey); i++) {
      uniqueKey = fullPath + ` ${i+1}` + typeName;
    }
    // set the actual data
    setItem(systemId + '/' + uniqueKey, content);
  }
};

export const setItem = (key, value) => {
  const [systemId, ...path] = key.split('/').filter(i=>i);
  systems[systemId]?.setItem(path.join('/'), JSON.stringify(value));
};

const systemHasItem = (systemId, key) => {
  const system = systems[systemId];
  for (let i=0; i<system?.length; i++) {
    if (system.key(i) === key) {
      return true;
    }
  }
};

export const hasItem = async key => {
  const [systemId, ...path] = key.split('/');
  return systemHasItem(systemId, path.join('/'));
};

export const getItem = async key => {
  const [systemId, ...path] = key.split('/');
  const item = await systems[systemId]?.getItem(path.join('/'));
  try {
    return item ? JSON.parse(item) : null;
  } catch(x) {
    return item;
  }
};

export const renameItems = async (from, to) => {
  const [systemId, ...path] = from.split('/');
  const fromPath = path.join('/');
  const system = systems[systemId];
  //
  const [_, ..._path] = to.split('/');
  const toPath = _path.join('/');
  //
  const keys = await system?.getKeys(fromPath) || [];
  keys.forEach(key => 
    renameItem(system, key, toPath + key.slice(fromPath.length))
  );
};

/*export*/ const renameItem = async (system, from, to) => {
  const item = await system.getItem(from);
  system.setItem(to, item);
  system.removeItem(from);
  log.debug('rename', from, ' => ', to);
};

export const removeFolder = async key => {
  const [systemId, ...path] = key.split('/'), systemKey = path.join('/'), system = systems[systemId];
  const keys = await system?.getKeys(systemKey);
  keys?.forEach(key => system?.removeItem(key));
};

export const removeItem = async key => {
  const [systemId, ...path] = key.split('/'), systemKey = path.join('/'), system = systems[systemId];
  log('removeItem', systemId, systemKey);
  //return system?.removeItem(systemKey);
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
    this.rootKey = firebaseRealtimeDb + (root ? '/' + root : '');
    this.authToken = authToken;
  }
  getUrl(key, ...urlArgs) {
    const _key = basinateKey(key).replaceAll('(', '%28').replaceAll(')', '%29');
    const args = [this.authToken ? `auth=${this.authToken}` : '', ...(urlArgs||[])].filter(i=>i).join('&');
    return `${this.rootKey}${_key}.json?${args}`;
  }
  async getFolders() {
    const result = this.root && await fetch(this.getUrl('', 'shallow=true'));
    this.fileSystem = (await result?.json()) || {};
    this.fsKeys = Object.keys(this.fileSystem).map(key => unbasinateKey(key));
    this.length = this.fsKeys.length;
    return this;
  }
  key(index) {
    return this.fsKeys[index];
  }
  async getKeys(prefix) {
    return !prefix ? this.fsKeys : this.fsKeys.filter(key => key.startsWith(prefix));
  }
  setItem(key, content) {
    return fetch(this.getUrl(key), {method: 'put', body: JSON.stringify(content)});
  }
  async getItem(key) {
    return (await fetch(this.getUrl(key), {method: 'get'})).json();
  }
  async removeItem(key) {
    return (await fetch(this.getUrl(key), {method: 'delete'})).json();
  }
};

const isEmpty = dictionary => Boolean(!dictionary || typeof dictionary !== 'object' || !Object.keys(dictionary).length);
const byName = (a, b) => (a.name === 'Deleted') ? 1 : (b.name === 'Deleted') ? -1 : a.name.localeCompare(b.name);
const byEntries = (a,b) => (a.hasEntries && !b.hasEntries) ? -1 : (!a.hasEntries && b.hasEntries) ? 1 : 0;

const firebaseRealtimeDb = 'https://xenon-js-default-rtdb.firebaseio.com/v9';

const basinateKey = key => key ? '/' + key.replaceAll('/', '*') : '';
const unbasinateKey = key => key.replaceAll('*', '/');
