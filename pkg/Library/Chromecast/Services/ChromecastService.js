/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {loadScript} from '../../Dom/Common/dom.js';

// What's great for a snack, and fits on your back? It's log, log, log
const log = logf('ChromecastService', '#ff006e', 'white');
log.flags.ChromecastService = true;

let resolveContext;
const contextPromise = new Promise(resolve => resolveContext = resolve);

window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi();
  }
};
const initializeCastApi = function() {
  const context = cast.framework.CastContext.getInstance();
  context.setOptions({
    receiverApplicationId: '94DC1ED3',
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  });
  resolveContext(context);
  console.log('CastApi initialized');
  console.log(context);
};

const getChromecastContext = () => {
  if (!getChromecastContext.loaded) {
    getChromecastContext.loaded = true;
    loadScript({src: '//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'});
  }
  return contextPromise;
}

export const ChromecastService = {
  async Render(packet) {
    const context = await getChromecastContext();
    if (context) {
      const session = context.getCurrentSession();
      if (session) {
        session.sendMessage('urn:x-cast:xjs-render-packet', JSON.stringify(packet));
      }
    }
  }
};
