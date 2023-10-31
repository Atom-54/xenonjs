/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xenonPath = new URL('../', import.meta.url).href.slice(0, -1);

globalThis.config = {
  // as needed
  xenonPath,
  // storage prefix
  aeon: 'xenon/0.3.0',
  paths: {
    // as needed
    $library: `${xenonPath}/Library`,
    // next two paths only needed if using workers
    $xenon: xenonPath,
    $boot: `${xenonPath}/Run/web/xenon.js`,
  },
  logFlags: {
    App: true,
    Atom: true,
    //Binder: true,
    //BusTerminal: true,
    //Composer: true,
    Graphs: true,
    //Host: true,
    //Industry: true,
    Library: true,
    Main: true,
    //MessageBus: true,
    //Persist: true,
    //Reactor: true,
    //Worker: true,
    //WorkerTransit: true
  },
  firebaseGraphsURL: "https://xenon-js-default-rtdb.firebaseio.com/0_3/publicGraphs"
};

globalThis.html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();
