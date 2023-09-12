/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// let xenonPath = 'https://xenon-js.web.app/0.5/';
// if (import.meta.url.startsWith('http://localhost')) {
//   xenonPath = new URL('../', import.meta.url).href;
// }
const xenonPath = new URL('../', import.meta.url).href.slice(0, -1);

globalThis.config = {
  xenonPath,
  // storage prefix
  aeon: 'xenon/0.3.0',
  paths: {
    // as needed
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
    DesignApp: true,
    //DOM: true,
    Graphs: true,
    //Host: true,
    //Industry: true,
    Library: true,
    Main: true,
    //MessageBus: true,
    //Persist: true,
    Reactor: true,
    Services: true,
    //Worker: true,
    //WorkerTransit: true
  }
};

globalThis.html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();
