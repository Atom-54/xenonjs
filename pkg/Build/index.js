/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import 'xenonjs/Library/Common/configKeys.js';
import 'xenonjs/Library/CoreReactor/Atomic/js/logf.js';
import {connectXenon} from 'xenonjs/Library/CoreReactor/Worker/xenon-web-worker.js';
import * as App from 'xenonjs/Library/CoreFramework/App.js';
import * as Composer from 'xenonjs/Library/CoreFramework/Composer.js';
import {main} from './main.js';

(async () => {
  try {
    const {xenon} = await connectXenon();
    await main(xenon, App, Composer);
  } catch(x) {
    console.error(x);
  }
})();
