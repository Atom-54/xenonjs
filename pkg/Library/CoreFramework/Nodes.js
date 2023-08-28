/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Paths} from '../../Library/CoreReactor/Atomic/js/utils/paths.js';

const log = logf('Nodes', 'lightgreen', 'gray');
logf.flags.Nodes = true;

const registeredMetas = {};

export const getNodeMeta = async type => {
  if (typeof type === 'string') {
    return (registeredMetas[type.replace(/\//g, '$')] ??= await requireNodeMeta(type));
  }
  return type;
};

// make `namedNodeMetas` available directly from `getNodeMeta` without importing
export const registerNamedNodeMetas = namedNodeMetas => Object.assign(registeredMetas, namedNodeMetas);

const nodeMetaModulePromises = {};

const requireNodeMeta = async type => {
  const module = (nodeMetaModulePromises[type] ??= importNodeMetaModule(type));
  try {
    const name = type.split('/').pop();
    return (await module)[name];
  } catch(x) {
    log.warn(x);
  }
  return 0;
};

const importNodeMetaModule = async type => {
  const path = type.includes('$') ? Paths.resolve(`${type}.js`) : `../nodes/${type}.js`;
  return import(path);
};