/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const log = logf('Persist', 'yellow', 'black');

export const persistValue = (key, value) => {
  key = `${globalThis.config.aeon}/${key}`;
  log('persist', key);
  if (key.endsWith('graphs')) {
    const graphKeys = new Set();
    value?.forEach(g => {
      const graphKey = `${key}.${g.meta.id}`;
      localStorage.setItem(graphKey, JSON.stringify(g))
      graphKeys.add(graphKey);
    });
    for (let i=0; i<localStorage.length; i++) {
      const storeKey = localStorage.key(i);
      if (storeKey.startsWith(`${key}.`) && !graphKeys.has(storeKey)) {
        localStorage.removeItem(storeKey);
      }
    }
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const restoreValues = async (persistables, state) => {
  for (const key of Object.keys(persistables??0)) {
    const value = await restoreValue(key);
    if (value != null) {
      log('restored', key, value);
      state[key] = value;
    }
  }
};

export const restoreValue = async key => {
  key = `${globalThis.config.aeon}/${key}`;
  log('restore', key);
  let value;
  if (key.endsWith('graphs')) {
    value = [];
    for (let i=0; i<localStorage.length; i++) {
      const storeKey = localStorage.key(i);
      if (storeKey.startsWith(`${key}.`)) {
        value.push(getValue(storeKey));
      }
    }
  } else {
    return getValue(key);
  }
  return value;
};

const getValue = key => {
  let value = localStorage.getItem(key);
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (e) {
      log(e);
    }
  }
  return value;
};
