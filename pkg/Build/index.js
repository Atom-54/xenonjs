/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import 'xenonjs/Apps/common/configKeys.js';
import {connectXenon} from 'xenonjs/Library/CoreReactor/Worker/xenon-web-worker.js';
import * as App from 'xenonjs/Library/CoreFramework/App.js';
import * as Composer from 'xenonjs/Library/CoreFramework/Composer.js';
import {main} from './main.js';

// do a body fade-in just to mask font-fouc
// or other brief improprieties
requestAnimationFrame(() => {
  Object.assign(document.documentElement.style, {
    opacity: 0,
    //scale: 20
  });
  setTimeout(() => Object.assign(document.documentElement.style, {
    transition: 'all 400ms ease-in-out',
    opacity: 1,
    //scale: 1
  }), 100);
});

(async () => {
  try {
    const {xenon/*, terminal*/} = await connectXenon();
    await xenon.industrialize();
    await main(xenon, App, Composer);
  } catch(x) {
    console.error(x);
  }
})();
