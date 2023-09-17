/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import 'xenonjs/Library/Common/configKeys.js';
import 'xenonjs/Library/CoreXenon/Reactor/Atomic/js/logf.js';
//import {connectXenon} from '../../Library/CoreXenon/Reactor/Worker/xenon-web-worker.js';
import {connectXenon} from './connectXenon.js';
import * as Composer from '../../Library/CoreXenon/Framework/Composer.js';
import {main} from './main.js';

(async () => {
  try {
    const {xenon} = await connectXenon();
    await main(xenon, Composer);
  } catch(x) {
    console.error(x);
  }
})();
