/**
 * Vanilla isolation uses global scope for Atoms.
 * @module vanilla
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {injections} from './injections.js';
Object.assign(globalThis, injections);
