/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xenonPath = new URL('../../../..', import.meta.url).href;

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
  // firebaseGraphsURL: "https://xenon-js-default-rtdb.firebaseio.com/0_3/demos/0723/publicGraphs"
  // for local developement:
  // firebaseGraphsURL: "https://xenon-js-default-rtdb.firebaseio.com/publicGraphs"
  firebaseGraphsURL: "https://xenon-js-default-rtdb.firebaseio.com/0_3/publicGraphs"
};

globalThis.html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();
