/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {SafeObject} from '../CoreReactor/safe-object.js';

const {keys} = SafeObject;
const log = logf('Library', 'lightgreen', 'black');

export const importLibraries = async libraries => {
  let library = await importLibrary('library', `${globalThis.config.xenonPath}/Library`);
  for (let names=keys(libraries), i=0, name; (name=names[i]); i++) {
    library = await appendLibrary(library, name, libraries[name]);
  }
  return library;
};

export const importLibrary = async (name, path, manifestPath) => {
  const map = {[`$${name}`]: path};
  globalThis.Paths.add(map);
  let library = {services: [], nodeTypes: {}};
  try {
    manifestPath ||= path;
    const {services, nodeTypes} = await import(`${manifestPath}/manifest.js`)
    library = {services, nodeTypes};
    log.groupCollapsed('Library: ', path);
    log(library);
    //log(JSON.stringify(library, null, '  '));
    log.groupEnd();
  } catch(x) {
    log.warn('failed to load library', path);
    log.warn(x);
  }
  return library;
};

export const appendLibrary = async ({services, nodeTypes}, name, path, manifestPath) => {
  const library = await importLibrary(name, path, manifestPath);
  library.services = {...services, ...library.services};
  library.nodeTypes = {...nodeTypes, ...library.nodeTypes};
  log.warn(name, path, manifestPath, services, nodeTypes)
  return library;
};