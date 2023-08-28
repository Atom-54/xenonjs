/**
 * @module Worker
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const log = logf('Worker:blaarg', 'red', 'black');
// produce a worker-context that boostraps via imports
export const blaargWorker = code => {
  const blob = new Blob([code], {type: 'application/javascript'});
  const oUrl = URL.createObjectURL(blob);
  const worker = new Worker(oUrl, {type: 'module', name: 'xenonjs'});
  setTimeout(() => URL.revokeObjectURL(oUrl), 1000);
  // log.groupCollapsed('Worker launched (blarg!)');
  // log.log(code);
  // log.groupEnd();
  // return worker;
  const connection = {
    addEventListener: (type, ...args) => {
      //console.log('WorkerConnection:addEventListener', type, ...args);
      worker.addEventListener(type, ...args);
    },
    postMessage: (...args) => {
      //console.log('WorkerConnection:postMessage', args);
      worker.postMessage(...args);
    }
  };
  log('WebWorker blaarged (arrr)');
  return connection;
};
