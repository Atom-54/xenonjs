/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
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
