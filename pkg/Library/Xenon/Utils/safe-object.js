/**
 * @module Utils
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = Object;

export const SafeObject = {
  create: O.create,
  assign: O.assign,
  nob() {
    return O.create(null)
  },
  keys(o) {
    return o ? O.keys(o) : [];
  },
  values(o) {
    return o ? O.values(o) : [];
  },
  entries(o) {
    return o ? O.entries(o) : [];
  },
  mapBy(a, keyGetter) {
    return SafeObject.values(a).reduce((map, item) => (map[keyGetter(item)] = item, map), SafeObject.nob())
  },
  map(o, visitor) {
    return SafeObject.entries(o).map(([key, value]) => visitor(key, value));
  }
};

export const {create, assign, keys, values, entries, nob, map, mapBy} = SafeObject;
