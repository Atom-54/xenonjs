/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 * @module raw-industry
 */

import {Host} from '../atomic-core.js';
import * as Reactor from './basic-reactor.js';

const log = logf('Industry: Raw', '#333', 'goldenrod');

export const industrialize = atoms => {
  Reactor.industrialize(atoms, log);
};

export const emit = async (name, kind) => {
  const factory = Reactor.getFactory(kind);
  if (factory) {
    return Reactor.enhosten(new Host(name), factory);
  }
  log.warn('failed to find factory for', kind);
};
