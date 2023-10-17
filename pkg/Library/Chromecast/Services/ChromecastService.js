/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {loadScript} from '../../Dom/Common/dom.js';
import {ChromecastComposer}  from '../ChromecastComposer.js';
import * as Layers from '../../CoreXenon/Framework/Layers.js';

// What's great for a snack, and fits on your back? It's log, log, log
const log = logf('ChromecastService', '#ff006e', 'white');
log.flags.ChromecastService = true;

const RENDER_MSG_TYPE = 'urn:x-cast:xjs-render-packet';

let context, resolveContext;
const contextPromise = new Promise(resolve => resolveContext = resolve);

window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi();
  }
};

const initializeCastApi = function() {
  context = cast.framework.CastContext.getInstance();
  context.setOptions({
    receiverApplicationId: '94DC1ED3',
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  });
  resolveContext(context);
  //context.addEventListener('CAST_STATE_CHANGED', onSessionChanged);
  const {SESSION_STATE_CHANGED} = cast.framework.CastContextEventType
  context.addEventListener(SESSION_STATE_CHANGED, onSessionChanged);
  log('CastApi initialized');
};

const onSessionChanged = event => {
  log(event);
  if (event.sessionState === 'SESSION_ENDED') {
    //
  } else if (event.sessionState === 'SESSION_STARTED') {
    values(flan.layers).forEach(layer => {
      if (layer.composer2 instanceof ChromecastComposer) {
        Layers.rerender(layer);
      }
    })
  }
};

const getChromecastContext = () => {
  if (!getChromecastContext.loaded) {
    getChromecastContext.loaded = true;
    loadScript({src: '//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'});
  }
  return contextPromise;
};

export const ChromecastService = {
  GetCurrentSession() {
    return context?.getCurrentSession();
  },
  async GetComposerId() {
    await getChromecastContext();
    if (!ChromecastService.composerResourceId) {
      ChromecastService.composerResourceId = Resources.allocate(ChromecastComposer);
    }
    return ChromecastService.composerResourceId;
  },
  async Render(packet) {
    const context = await getChromecastContext();
    const session = context?.getCurrentSession();
    try {
      await session?.sendMessage(RENDER_MSG_TYPE, JSON.stringify(packet));
    } catch(x) {
      log.warn(x);
      log(packet);
    }
  }
};
