/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import './config.js';
import {Params} from '../../Library/Xenon/Utils/params.js';
import {graph as baseGraph} from '../../Graphs/Base.js';
import * as Persist from '../../Library/CoreFramework/Persist.js';
import '../../Library/Dom/common/dom.js';
import * as Library from '../../Library/CoreFramework/Library.js'

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');
logf.flags.Main = true;
const localPrefix = 'local$';

export const main = async (xenon, App, Composer) => {
  // from whence, graph?
  let buildGraph = null;
  let graphId = Params.getParam('graph');
  if (graphId) {
    if (graphId.startsWith(localPrefix)) {
      buildGraph = await restoreLocalGraph(graphId.substring(localPrefix.length));
    } else {
      buildGraph = await fetchFbGraph(graphId);
    }
  } else { // no URL param
    const selectedId = await Persist.restoreValue(`$GraphList$graphAgent$selectedId`);
    buildGraph = await restoreLocalGraph(selectedId);
  }

  if (buildGraph) {
    //
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
    const {services} = await loadLibraries(buildGraph.meta, await Persist.restoreValue('$UserSettings$settings$userSettings'));
    xenon.setPaths(Paths.map);
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

const restoreLocalGraph = async (id) => {
  return Persist.restoreValue(`$GraphList$graphAgent$graphs.${id}`);
};

const fetchFbGraph = async (id) => {
  const url = `${globalThis.config.firebaseGraphsURL}/${id}.json`;
  const res = await fetch(url);
  if (res.status === 200) {
    const text = (await res.text())?.replace(/%/g, '$');
    const graph = JSON.parse(text);
    return (typeof graph === 'string') ? JSON.parse(graph) : graph;
  }
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
