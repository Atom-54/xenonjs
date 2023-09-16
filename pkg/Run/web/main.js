/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import {Params} from '../../Library/Xenon/Utils/params.js';
import {graph as baseGraph} from '../../Graphs/Base.js';
import * as Persist from '../../Library/CoreFramework/Persist.js';
import {loadGraph, graphParamForMeta} from '../../Library/CoreDesigner/GraphService.js';
import '../../Library/Dom/Common/dom.js';
import * as Library from '../../Library/CoreFramework/Library.js'

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');
logf.flags.Main = true;

export const main = async (xenon, App, Composer) => {
  // from whence, graph?
  const graphId = await retrieveGraphId();
  const buildGraph = await loadGraph(graphId);
  if (buildGraph) {
    log(`Loaded graph '${graphId}'`, buildGraph);
    document.title = buildGraph.meta.id;
    // TODO: support assigning icons for graphs (maybe auto-generate?)
    if (buildGraph.meta.icon) {
      document.querySelector("link[rel~='icon']").href = buildGraph.meta.icon;
    }
    buildGraph.state[`Main$designer$disabled`] = true;
    buildGraph.nodes['footer'] = {
      type: "$library/NeonFlan/Nodes/FooterNode",
      container: "root$panel#Container"
    };
    log(buildGraph);
    //
    const {services} = await loadLibraries(buildGraph.meta, await Persist.restoreValue('$UserSettings$settings$userSettings'));
    xenon.setPaths(Paths.map);
    // TODO(sjmiles): experimental: make layering more accessible
    App.createLayer.simple = async (graph, name) => {
      return await App.createLayer([graph], xenon.emitter, Composer, services, name);
    };    
    //
    // create app with Atom emitter
    const app = await App.createLayer([baseGraph, buildGraph], xenon.emitter, Composer, services);
    await App.initializeData(app);
    log('app is live 🌈');
    globalThis.app = app;
    return app;
  } else {
    log(`Graph '${graphId}' not found.`);
  }
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
      Object.assign(libraries, userSettings?.customLibraries);
    }
  } catch(e) {
    log.warn(`Failed to parse libraries: ${libString} (error: ${e})`);
  }
  return Library.importLibraries(libraries);
};
