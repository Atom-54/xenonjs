/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/* global chrome */

const ports = [];

// call like this
// chrome.runtime.onConnect.addListener(port => connected(port));
export const connected = port => {
  console.log("[hub] connected new port");
  ports.push(port);
  //
  //port.postMessage({greeting: "hi there content script!"});
  port.onMessage.addListener(m => {
    if (m?.type === 'ready') {
      m.signal = {type: 'ready'};
    }
    //   console.log("[BACKGROUND] received ready message", m.nom, m.id)
    //   m.type = 'signal';
    //   m
    // }
    // if (m?.type === 'signal') {
    route(m);
      // console.log('[BACKGROUND] routing', m.signal);
      // const {forwarded, ...msg} = m;
      // ports.forEach(port => port.postMessage(msg));
    //}
  });
  port.onDisconnect.addListener(() => {
    console.log('[BACKGROUND] disconnecting port 👋');
    ports.splice(ports.indexOf(port), 1);
    route({type: 'signal', signal: {type: 'bye'}});
  });
};

const route = (msg) => {
  console.log('[BACKGROUND] routing', msg.signal);
  const {forwarded, ...m} = msg;
  ports.forEach(port => port.postMessage(m));
};
