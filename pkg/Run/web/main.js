/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import {SafeObject} from '../../Library/CoreReactor/safe-object.js';
import {Params} from '../../Library/Xenon/Utils/params.js';
import {graph as baseGraph} from '../../Graphs/Base.js';
import * as Persist from '../../Library/CoreFramework/Persist.js';
import '../../Library/Dom/common/dom.js';
import * as Library from '../../Library/CoreFramework/Library.js'

const {assign, values} = SafeObject;

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');
logf.flags.Main = true;

export const main = async (xenon, App, Composer) => {
  // from whence, graph?
  const graphId = Params.getParam('graph') || await Persist.restoreValue(`$GraphList$graphAgent$selectedId`);
  const buildGraph = GraphService.loadGraph(graphId);
  if (buildGraph) {
    document.title = buildGraph.meta.id;
    // TODO: support assigning icons for graphs (maybe auto-generate?)
    if (buildGraph.meta.icon) {
      document.querySelector("link[rel~='icon']").href = buildGraph.meta.icon;
    }
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
    log(`Graph not found.`);
  }
};

<<<<<<< HEAD
=======
const restoreLocalGraph = async (id) => {
  return Persist.restoreValue(`$GraphList$graphAgent$graphs.${id}`);
};

const fetchFbGraph = async (id) => {
  const url = `${globalThis.config.firebaseGraphsURL}/${id}.json`;
  const res = await fetch(url);
  if (res.status === 200) {
    const text = (await res.text())?.replace(/%/g, '$');
    const graph = JSON.parse(text);
    if (graph) {
      return (typeof graph === 'string') ? JSON.parse(graph) : graph;
    }
  }
  return findFbGraph(id);
};

const findFbGraph = async (id) => {
  const res = await fetch(`${globalThis.config.firebaseGraphsURL}.json`);
  if (res.status === 200) {
    const text = (await res.text())?.replace(/%/g, '$');
    const graphs = JSON.parse(text);
    for (const userGraphs of values(graphs)) {
      if (userGraphs[id]) {
        return JSON.parse(userGraphs[id]);
      }
    }
  }
};

>>>>>>> 7787b2f (Run to support graph search by name only, and bump README Run version)
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
