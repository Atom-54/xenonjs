/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// What's great for a snack, and fits on your back? It's log, log, log
const log = logf('ChromecastService', '#ff006e', 'white');
log.flags.ChromecastService = true;

export const ChromecastService = {
  Connect(layer, atom, data) {
    //log(context);
    //connect();
  }
};

const applicationId = 'C46C44F7';
const namespace = 'urn:x-cast:com.xenonjs.chromecast-dashboard';

let context = null;

if (!globalThis?.cast?.isAvailable) {
  setTimeout(initializeCastApi, 1000);
}

function initializeCastApi() {
  context = cast.framework.CastContext.getInstance();
  context.setOptions({
    receiverApplicationId: applicationId,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  });
  const states = cast.framework.SessionState;
  context.addEventListener(  
    cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
    event => {
      switch (event.sessionState) {
        case states.SESSION_STARTED:
        case states.SESSION_RESUMED:
          log('CastContext: CastSession started/resumed');
          break;
        case states.SESSION_ENDED:
          log('CastContext: CastSession disconnected');
          // Update locally as necessary
          break;
      }
    }
  );
  log(context);
  log(context.getCurrentSession());
  //context.start();
  //const sessionRequest = new context.SessionRequest(applicationID);
  // log(sessionRequest);
  // const apiConfig = new chrome.cast.ApiConfig(
  //   sessionRequest,
  //   sessionListener,
  //   receiverListener
  // );
  // chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

// function onInitSuccess() {
//   log('onInitSuccess');
// }

// function onError(message) {
//   log('onError: ' + JSON.stringify(message));
// }

// function onSuccess(message) {
//   log('onSuccess: ' + JSON.stringify(message));
//   if (message['type'] == 'load') {
//     // $('#kill').prop('disabled', false);
//     // $('#post-note').show();
//   }
// }

// function onStopAppSuccess() {
//   log('onStopAppSuccess');
//   // $('#kill').prop('disabled', true);
//   // $('#post-note').hide();
// }

// function sessionListener(e) {
//   log('New session ID: ' + e.sessionId);
//   session = e;
//   session.addUpdateListener(sessionUpdateListener);
// }

// function sessionUpdateListener(isAlive) {
//   log((isAlive ? 'Session Updated' : 'Session Removed') + ': ' + session.sessionId);
//   if (!isAlive) {
//     session = null;
//   }
// };

// function receiverListener(e) {
//   // Due to API changes just ignore this.
// }

// function sendMessage(message) {
//   if (session != null) {
//     session.sendMessage(namespace, message, onSuccess.bind(this, message), onError);
//   }
//   else {
//     chrome.cast.requestSession(function(e) {
//       session = e;
//       sessionListener(e);
//       session.sendMessage(namespace, message, onSuccess.bind(this, message), onError);
//     }, onError);
//   }
// }

// function stopApp() {
//   session.stop(onStopAppSuccess, onError);
// }

// const url = 'https://xenon-js.web.app/0.3.0/index.html';
// const refresh = true;

const connect = async() => {
  //await context.requestSession();
//     log('connect()');
//   sendMessage({
//     type: 'load',
//     url,
//     refresh
//     // url: $('#url').val(),
//     // refresh: $('#refresh').val(),
//   });
};

// $('#kill').on('click', stopApp);

// // Populate input fields from query params
// $(function () {
//   if (!'URLSearchParams' in window) {
//     return;
//   }

//   var params = new URLSearchParams(window.location.search);
//   if (params.has('url')) {
//     $('#url').val(params.get('url'));
//   }

//   if (params.has('refresh')) {
//     $('#refresh').val(params.get('refresh'));
//   }
// });