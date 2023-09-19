/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xenonPath = 'http://localhost:9871/latest'
//const xenonPath = 'https://xenon-js.web.app/latest';

globalThis.config = {
  // as needed
  xenonPath,
  // storage prefix
  aeon: 'v1',
  paths: {
    // as needed
    $library: `${xenonPath}/Library`,
  },
  logFlags: {
    //App: true,
    Atom: true,
    //Binder: true,
    //BusTerminal: true,
    //Composer: true,
    Graphs: true,
    //Host: true,
    //Industry: true,
    //MessageBus: true,
    Main: true,
    //Persist: true,
    //Reactor: true,
    //Worker: true,
    //WorkerTransit: true
  },
  publicGraphsPath: '0_3/publicGraphs'
};

globalThis.html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();
