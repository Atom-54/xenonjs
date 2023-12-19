/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {makeId} from '..//CoreXenon/Reactor/Atomic/js/utils/id.js';

let resources = {};

export const Resources = {
  newId() {
    return makeId(4, 4, '-');
  },
  get(id) {
    return resources[id];
  },
  set(id, resource) {
    resources[id] = resource;
    return id;
  },
  free(id) {
    Resources.set(id, null);
  },
  allocate(resource) {
    return Resources.set(Resources.newId(), resource);
  },
  all() {
    return resources;
  },
  use(_resources) {
    resources = _resources;
  }
};

globalThis.Resources = Resources;
