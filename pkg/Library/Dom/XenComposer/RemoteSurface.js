/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {XenComposer} from './XenComposer.js';

export const initSurface = root => {
  const composer = initComposer(root);
  return {
    composer,
    install: arc => installComposer(arc, composer)
  };
};

export const initComposer = root => {
  const useShadowRoots = true;
  return new XenComposer(root, useShadowRoots);
};

export const installComposer = (arc, composer) => {
  arc.composer = composer;
  composer.onevent = (...args) => {
    return arc.onevent(...args);
  };
  Object.values(arc.hosts).forEach(host => host.invalidate());
};
