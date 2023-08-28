/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
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