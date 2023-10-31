/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// connect to the extension
const port = chrome.runtime.connect();
port.postMessage({greeting: "hello from content script"});
// not disconnecting `port` manually (`port.disconnect()`) may yield
// 'Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.' 

//const log = console.log.bind(console);
const log = _=>_;

let clientId;

// forward messages from the extension to the client window
const forwardToClient = msg => {
  // the wake-up message must be fowarded even when there is no clientId
  if (msg.id !== clientId && msg.type && !msg.forwarded) {
    // messages received without clientId are squelched 
    // so console is opt-in
    clientId && log(`receiving ${msg.type} (${msg.id} => ${clientId})`, msg.signal ?? '');
    window.postMessage({...msg, forwarded: true}, '*');
  }
};
port.onMessage.addListener(forwardToClient);

// forward messages from the client window to the extension
const forwardToExtension = ({data: msg}) => {
  clientId = msg.id;
  if (msg.type && !msg.forwarded) {
    log(`sending ${msg.type}`, msg.ready ? msg.id : '', msg.signal ?? '');
    port.postMessage({...msg, forwarded: true});
  }
};
window.addEventListener('message', forwardToExtension);
  
// code injector
const loadInPage = src => document.firstElementChild.appendChild(Object.assign(document.createElement('script'), {src, type: 'module'}));
loadInPage(chrome.runtime.getURL('plugin/xenon-camera.js'));
