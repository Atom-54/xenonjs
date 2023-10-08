/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const SafeObject = {
  create: Object.create,
  assign(o, ...args) {
    return Object.assign(o || {}, ...args);
  },
  nob() {
    return Object.create(null)
  },
  keys(o) {
    return o ? Object.keys(o) : [];
  },
  values(o) {
    return o ? Object.values(o) : [];
  },
  entries(o) {
    return o ? Object.entries(o) : [];
  },
  mapBy(a, keyGetter) {
    return a ? Object.values(a).reduce((map, item) => (map[keyGetter(item)] = item, map), {}) : {};
  },
  map(o, visitor) {
    return SafeObject.entries(o).map(([key, value]) => visitor(key, value));
  }
};

export const {create, assign, nob, keys, values, entries, mapBy, map} = SafeObject;

