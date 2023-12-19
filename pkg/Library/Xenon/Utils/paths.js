/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PathMapper = class {
  map;
  constructor(root) {
    this.map = {};
    this.setRoot(root);
  }
  add(mappings) {
    Object.assign(this.map, mappings || {});
  }
  resolve(path) {
    let last;
    do {
      path = this._resolve(last = path);
    } while (last !== path);
    return path;
  }
  _resolve(path) {
    const bits = path.split('/');
    const top = bits.shift();
    const prefix = this.map[top] || top;
    return [prefix, ...bits].join('/');
  }
  setRoot(root) {
    if (root.length && root[root.length - 1] === '/') {
      root = root.slice(0, -1);
    }
    this.add({
      '$root': root,
      '$xenon': root
    });
  }
  getAbsoluteHereUrl(meta, depth) {
    // you are here
    const localRelative = meta.url.split('/').slice(0, -(depth ?? 1)).join('/');
    if (!globalThis?.document) {
      return localRelative;
    }
    else {
      // document root is here
      let base = document.URL;
      // if document URL has a filename, remove it
      if (base[base.length - 1] !== '/') {
          base = `${base.split('/').slice(0, -1).join('/')}/`;
      }
      // create absoute path to here (aka 'local')
      let localAbsolute = new URL(localRelative, base).href;
      // no trailing slash!
      if (localAbsolute[localAbsolute.length - 1] === '/') {
          localAbsolute = localAbsolute.slice(0, -1);
      }
      return localAbsolute;
    }
  }
};

const root = ''; //import.meta?.url?.split('/').slice(0, -3).join('/');
const Paths = globalThis['Paths'] = new PathMapper(root ?? '');
const resolve = Paths.resolve.bind(Paths);

Paths.add(globalThis.config?.paths);

export {Paths, resolve};