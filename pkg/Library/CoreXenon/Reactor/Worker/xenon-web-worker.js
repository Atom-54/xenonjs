/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import '../Atomic/js/logf.js';
import {configureApi} from './xenon-outside.js';
import {blaargWorker} from './web-worker-blaarg.js';
import {BusTerminal} from '../Bus/BusTerminal.js';

const log = logf('Worker:xenon', '#B4C424', 'black');

const configJSON = JSON.stringify(globalThis.config, null, '  ');
const workerFile = `${config.paths.$library}/CoreXenon/Reactor/Worker/worker-boot.js`;

const workerMeBro = () => {
  const code = `
globalThis.config = ${configJSON};
// use dynamic import to delay load until after 
// globalThis.config assignment has occurred (not ideal)
export const {xenon} = await import('${workerFile}');
  `.trim();
  // create worker
  return blaargWorker(code);
};

const connect = async worker => {
  // create terminal to worker
  const terminal = new BusTerminal(worker);
  log('Main thread BusTerminal', terminal.bus.id)
  // get a xenon api
  const xenon = configureApi(terminal);
  // handshake readiness
  let isReady = false;
  // ready button
  let whenReady;
  // make a whenReady, and a promise that resolves whenReady is called
  const readyPromise = new Promise(resolve => 
    whenReady = value => {
      isReady = true;
      resolve({xenon, terminal});
    }
  );
  // if you don't do this some versions of Node will throw because 
  // they don't "trust" terminal.watch to complete isReady
  setTimeout(() => {
    if (!isReady) {
      log('isReady TIMED OUT')
      whenReady(true); 
    }
  }, 5000);
  // wait for ready message
  terminal.watch(msg => {
    if (msg?.kind === 'ready') {
      whenReady(true);
    }
  });
  // wait for ready promise
  return readyPromise;
};

export const connectXenon = async () => connect(workerMeBro());
