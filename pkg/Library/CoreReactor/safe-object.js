/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const {assign, keys, entries, values, create} = Object;

export const SafeObject = {
  create,
  assign,
  nob() {
    return create(null)
  },
  keys(o) {
    return o ? keys(o) : [];
  },
  values(o) {
    return o ? values(o) : [];
  },
  entries(o) {
    return o ? entries(o) : [];
  },
  mapBy(a, keyGetter) {
    return a ? values(a).reduce((map, item) => (map[keyGetter(item)] = item, map), {}) : {};
  },
  map(o, visitor) {
    return SafeObject.entries(o).map(([key, value]) => visitor(key, value));
  }
};