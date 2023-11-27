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
    if (storeId.includes('*')) {
      return restoreAll(storeId);
    } else {
      return getItem(storeId);
    }
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