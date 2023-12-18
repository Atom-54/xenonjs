/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import 'xenonjs/Library/common/configKeys.js';
import 'xenonjs/Library/CoreXenon/Reactor/Atomic/js/logf.js';
import {main} from 'xenonjs/Run/web/main.js';
import {connectXenon} from 'xenonjs/Run/web/connectXenon.js';
import * as Composer from 'xenonjs/Library/CoreXenon/Framework/Composer.js';

(async () => {
  try {
    const {xenon} = await connectXenon();
    await main(xenon, Composer);
  } catch(x) {
    console.error(x);
  }
})();
