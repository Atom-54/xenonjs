/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Params} from '../../Library/Xenon/Utils/params.js';
import {SafeObject} from 'xenonjs/Library/CoreReactor/safe-object.js';
import * as Persist from '../../Library/CoreFramework/Persist.js';
import * as Library from '../../Library/CoreFramework/Library.js'
import {Flan} from 'xenonjs/Library/CoreFramework/Flan.js';
import {loadGraph} from '../../Library/CoreDesigner/GraphService.js';
import {graph as baseGraph} from '../../Graphs/Base.js';

const {create, assign, keys, values} = SafeObject;

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');

export const main = async (xenon, App, Composer) => {
  // propagate config paths
  xenon.setPaths(Paths.map);
  // create main flan
  const flan = globalThis.flan = new Flan(App, xenon.emitter, Composer);
  // from whence, graph?
  const graphId = await retrieveGraphId();
  const graph = await loadGraph(graphId);
  if (graph) {
    return reifyGraph(flan, graph);
  } else {
    log(`Graph not found.`);
  }
};

const reifyGraph = async (flan, graph) => {
  document.title = graph.meta.id;
  // TODO: support assigning icons for graphs (maybe auto-generate?)
  if (graph.meta.icon) {
    document.querySelector("link[rel~='icon']").href = graph.meta.icon;
  }
  graph.state[`Main$designer$disabled`] = true;
  graph.nodes['footer'] = {
    type: "$library/NeonFlan/Nodes/FooterNode",
    container: "root$panel#Container"
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
    graphId = await Persist.restoreValue(`$GraphList$graphAgent$selectedId`);
    if (graphId) {
      graphId = `local$${graphId}`;
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
