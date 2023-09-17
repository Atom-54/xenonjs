/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {assign} from 'xenonjs/Library/CoreXenon/Reactor/safe-object.js';
import {Params} from 'xenonjs/Library/CoreXenon/Reactor/Atomic/js/utils/params.js';
import {Flan} from 'xenonjs/Library/CoreXenon/Framework/Flan.js';
import * as Persist from 'xenonjs/Library/CoreXenon/Framework/Persist.js';
import * as Library from 'xenonjs/Library/CoreXenon/Framework/Library.js'
import {loadGraph} from 'xenonjs/Library/CoreXenon/Designer/GraphService.js';
import {graph as baseGraph} from 'xenonjs/Library/Graphs/Base.js';

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');

export const main = async (xenon, App, Composer) => {
  // propagate config paths
  //xenon.setPaths(Paths.map);
  // create main flan
  const flan = globalThis.flan = new Flan(App, xenon.emitter, Composer);
  // from whence, graph?
  const graphId = await retrieveGraphId();
  const graph = await loadGraph(graphId);
  if (graph) {
    return reifyGraph(flan, graph);
  } else {
    log(`Graph '${graphId}' not found.`);
  }
};

const reifyGraph = async (flan, graph) => {
  document.title = graph.meta.id;
  // TODO: support assigning icons for graphs (maybe auto-generate?)
  if (graph.meta.icon) {
    document.querySelector("link[rel~='icon']").href = graph.meta.icon;
  }
  graph.state.Main$designer$disabled = true;
  graph.nodes.footer = {
    type: '$library/NeonFlan/Nodes/FooterNode',
    container: 'root$panel#Container'
  };
  //log(graph);
  //
  const {services} = await loadLibraries(graph.meta, await Persist.restoreValue('$UserSettings$settings$userSettings'));
  flan.services = services;
  //
  // create layer
  await flan.createLayer([baseGraph, graph], '');
  // ready;
  log('app is live 🌈');
};

const retrieveGraphId = async () => {
  let graphId = Params.getParam('graph');
  if (!graphId) {
    const meta = await Persist.restoreValue(`$GraphList$graphAgent$selectedMeta`);
    if (meta) {
      graphId = graphParamForMeta(meta);
    }
  }
  return graphId;
};

const loadLibraries = async ({customLibraries}, userSettings) => {
  const libraries = customLibraries ?? {};
  try {
    if (userSettings?.customLibraries) {
      assign(libraries, userSettings?.customLibraries);
    }
  } catch(e) {
    log.warn(`Failed to parse libraries: ${libString} (error: ${e})`);
  }
  return Library.importLibraries(libraries);
};
