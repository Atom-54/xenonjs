/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// let xenonPath = 'https://xenon-js.web.app/0.7/';
// if (import.meta.url.startsWith('http://localhost')) {
//   xenonPath = new URL('../', import.meta.url).href;
// }
const xenonPath = new URL('../', import.meta.url).href.slice(0, -1);

globalThis.config = {
  xenonPath,
  // storage prefix
  aeon: 'v1',
  paths: {
    // as needed
    $anewLibrary: `${xenonPath}/anewLibrary`,
    $library: `${xenonPath}/Library`,
    // next two paths only needed if using workers
    $xenon: xenonPath,
    $boot: `${xenonPath}/Build/xenon.js`
  },
  logFlags: {
    //App: true,
    Atom: true,
    //Binder: true,
    //BusTerminal: true,
    //Composer: true,
    //Design: true,
    //DOM: true,
    //Flan: true,
    //Graphs: true,
    //Host: true,
    //Industry: true,
    //Layers: true,
    //Library: true,
    Main: true,
    //MessageBus: true,
    //Nodes: true,
    //Persist: true,
    //Reactor: true,
    //Services: true,
    //Worker: true,
    //WorkerTransit: true
  },
  publicGraphsPath: 'v1/publicGraphs'
};

globalThis.html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();
