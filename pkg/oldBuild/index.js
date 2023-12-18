/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// configuration boostrap
import './config.js';
import 'xenonjs/Library/Common/configKeys.js';
import 'xenonjs/Library/CoreXenon/Reactor/Atomic/js/logf.js';
//import {connectXenon} from 'xenonjs/Library/CoreXenon/Reactor/Worker/xenon-web-worker.js';
import {connectXenon} from './connectXenon.js';
import * as Composer from 'xenonjs/Library/CoreXenon/Framework/Composer.js';
import {main} from './main.js';

// do a body fade-in just to mask font-fouc
// or other brief improprieties
requestAnimationFrame(() => {
  Object.assign(document.documentElement.style, {
    opacity: 0
  });
  setTimeout(() => Object.assign(document.documentElement.style, {
    transition: 'all 400ms ease-in-out',
    opacity: 1
  }), 2000);
});

(async () => {
  try {
    const {xenon} = await connectXenon();
    await main(xenon, Composer);
  } catch(x) {
    console.error(x);
  }
})();
