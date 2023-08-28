
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Worker} from 'worker_threads';
import * as fs from 'fs';

// produce a worker-context that boostraps via imports
export const blaargWorker = code => {
  const path = './worker.js';
  fs.writeFileSync(path, code); 
  //
  const worker = new Worker(path, {type: 'module', name: 'xenonjs'});
  //
  let onmessage = async msg => console.log('no-on-message', msg);
  worker.on('message', async msg => {
    await onmessage(msg);
  });
  const connection = {
    addEventListener: (type, fn) => {
      //console.log('MainConnection:addEventListener', type, fn);
      if (type === 'message') {
        onmessage = fn;
      } else {
        worker.on(type, fn);
      }
    },
    postMessage: (...args) => {
      //console.log('MainConnection:postMessage', args);
      worker.postMessage(...args);
    }
  };
  //
  //
  console.log('Worker blaarged for Nodejs');
  // log.groupCollapsed('Worker launched (blarg!)');
  // log.log(code);
  // log.groupEnd();
  return connection;
};