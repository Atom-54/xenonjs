/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './conf/config.js';
import {paths, Params} from './conf/allowlist.js';
import {RemoteApp} from './Library/RemoteApp.js';

const user = Params.getParam('user');
const group = Params.getParam('group');

try {
  const app = globalThis.app = new RemoteApp(paths);
  await app.spinup(user, group);
} catch(x) {
  console.error(x);
}