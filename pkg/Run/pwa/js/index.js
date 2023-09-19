/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import 'xenonjs/Library/common/configKeys.js';
import {connectXenon} from './connectXenon.js';
import * as Composer from '../../../Library/CoreXenon/Framework/Composer.js';
import {main} from './main.js';

window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }
};

(async () => {
  try {
    const {xenon} = await connectXenon();

    await main(xenon, Composer);
  } catch(x) {
    console.error(x);
  }
})();
