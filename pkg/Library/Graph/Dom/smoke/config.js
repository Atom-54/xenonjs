/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xenonPath = new URL('../../../..', import.meta.url).href.slice(0, -1);

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
    $boot: `${xenonPath}/Apps/Poetry/web/xenon.js`,
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
    Persist: true,
    //Reactor: true,
    //Worker: true,
    //WorkerTransit: true
  },
  publicGraphsPath: 'v1/publicGraphs'
};

globalThis.html = (strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();
