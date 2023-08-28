/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 * @module injections
 */
import {Paths, deepEqual, SafeObject} from '../atomic-core.js';

const log = logf('Reactor', '#333', 'goldenrod');
const html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();
const makeKey = () => `i${Math.floor((1 + Math.random() * 9) * 1e14)}`;
const timeout = async (func, delayMs) => new Promise(resolve => setTimeout(() => resolve(func()), delayMs));
const resolve = Paths.resolve.bind(Paths);

/** */
export const injections = {...SafeObject, log, resolve, html, makeKey, deepEqual, timeout};
