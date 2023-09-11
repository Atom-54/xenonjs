/* global chrome */
import './third-party/libp2p/index.min.js';
import './third-party/libp2p/webrtc/index.min.js';
import './third-party/libp2p/websockets/index.min.js';
import './third-party/libp2p/mplex/index.min.js';
import './third-party/libp2p/bootstrap/index.min.js';
import './third-party/libp2p/chainsafe/libp2p-noise/index.min.js';
import './third-party/libp2p/chainsafe/libp2p-yamux/index.min.js';

console.log(Object.keys(globalThis.Libp2P));
console.log(Object.keys(globalThis.Libp2PWebrtc));
console.log(Object.keys(globalThis.Libp2PWebsockets));
console.log(Object.keys(globalThis.Libp2PMplex));
console.log(Object.keys(globalThis.Libp2PBootstrap));
console.log(Object.keys(globalThis.ChainsafeLibp2PNoise));
console.log(Object.keys(globalThis.ChainsafeLibp2PYamux));

const {createLibp2p} = globalThis.Libp2P;
const {webSockets} = globalThis.Libp2PWebsockets;
const {mplex} = globalThis.Libp2PMplex;
const {bootstrap} = globalThis.Libp2PBootstrap;
const {noise} = globalThis.ChainsafeLibp2PNoise;
const {yamux} = globalThis.ChainsafeLibp2PYamux;

// Known peers addresses
const bootstrapMultiaddrs = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
];

const start = async () => {
  const node = await createLibp2p({
    transports: [webSockets()],
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    peerDiscovery: [
      bootstrap({
        list: bootstrapMultiaddrs // provide array of multiaddrs
      })
    ]
  });
  console.log(node);
  // start libp2p
  await node.start();
  console.log('libp2p has started');
  //
  // do work
  //
  // const listenAddrs = node.getMultiaddrs()
  // console.log('libp2p is listening on the following addresses: ', listenAddrs);
  node.addEventListener('peer:discovery', (evt) => {
    console.log('Discovered %s', evt.detail.id); // Log discovered peer
  });
  node.addEventListener('peer:connect', (evt) => {
    console.log('Connected to %s', evt.detail); // Log connected peer
  });
  //
  // stop libp2p
  //await node.stop()
  //console.log('libp2p has stopped')
};
start();

// chrome.action.onClicked.addListener(async () => {
//   const url = chrome.runtime.getURL("hello.html");
//   /*const tab = */await chrome.tabs.create({url});
// });

// onmessage = event => {
//   console.log(event);
// };

// chrome.runtime.onMessage.addListener(event => {
//   console.log(event);
// });