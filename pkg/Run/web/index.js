/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import 'xenonjs/Apps/common/configKeys.js';
import {connectXenon} from '../../Library/CoreReactor/Worker/xenon-web-worker.js';
import * as App from '../../Library/CoreFramework/App.js';
import * as Composer from '../../Library/CoreFramework/Composer.js';
import {main} from './main.js';

(async () => {
  try {
    const {xenon/*, terminal*/} = await connectXenon();
    await xenon.industrialize();
    await main(xenon, App, Composer);
  } catch(x) {
    console.error(x);
  }
})();
