/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import './app/config.js';
import {quickStart} from './app/arcs.js';
import {ExtensionApp} from './app/ExtensionApp.js';

await quickStart(ExtensionApp, import.meta.url, {
  $nodegraph: '$app/deploy/nodegraph/Library'
});
