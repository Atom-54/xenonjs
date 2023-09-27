/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Params} from 'xenonjs/Library/CoreXenon/Reactor/Atomic/js/utils/params.js';
import * as Flan from 'xenonjs/Library/CoreXenon/Framework/Flan.js';
import * as Persist from 'xenonjs/Library/CoreXenon/Framework/Persist.js';
import * as Library from 'xenonjs/Library/CoreXenon/Framework/Library.js'
import {loadGraph, graphParamForMeta} from 'xenonjs/Library/CoreXenon/Designer/GraphService.js';
import {graph as baseGraph} from 'xenonjs/Library/Graphs/Base.js';

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');

export const main = async (xenon, Composer) => {
  await xenon.industrialize();
  //xenon.setPaths(Paths.map);
  // from whence, graph?
  const graphId = await retrieveGraphId();
  const graph = await loadGraph(graphId);
  if (graph) {
    const library = await Library.importLibraries(graph.meta.customLibraries ?? {});
    // create main flan
    const flan = globalThis.flan = Flan.createFlan(xenon.emitter, Composer, library);
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
  // create layer
  await Flan.createLayer(flan, [baseGraph, graph], 'base');
  // ready;
  log('app is live 🌈');
};

const retrieveGraphId = async () => {
  let graphId = Params.getParam('graph');
  if (!graphId) {
    const meta = await Persist.restoreValue(`base$GraphList$graphAgent$selectedMeta`);
    if (meta) {
      graphId = graphParamForMeta(meta);
    }
  }
  return graphId;
};
