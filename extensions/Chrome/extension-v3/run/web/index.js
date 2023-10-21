/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import '../Library/Common/configKeys.js';
import '../Library/CoreReactor/Atomic/js/logf.js';
import {connectXenon} from './xenon.js';
//import {connectXenon} from '../../Library/CoreReactor/Worker/xenon-web-worker.js';
import * as App from '../Library/CoreFramework/App.js';
import * as Composer from '../Library/CoreFramework/Composer.js';
import {main} from './main.js';

(async () => {
  try {
    const {xenon} = await connectXenon();
    await main(xenon, App, Composer);
  } catch(x) {
    console.error(x);
  }
})();
