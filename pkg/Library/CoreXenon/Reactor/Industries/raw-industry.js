/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Basic from './basic-reactor.js';

const log = logf('Industry: Raw', '#333', 'goldenrod');

export const industrialize = atoms => {
  Basic.industrialize(atoms, log);
};

export const emit = async (Host, name, kind) => {
  const factory = Basic.getFactory(kind);
  if (factory) {
    return Basic.enhosten(new Host(name), factory);
  }
  log.warn('failed to find factory for', kind);
};
