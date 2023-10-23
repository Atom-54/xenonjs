/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {assign, keys, values} from 'xenonjs/Library/CoreXenon/Reactor/safe-object.js';
import {Params} from 'xenonjs/Library/CoreXenon/Reactor/Atomic/js/utils/params.js';
import * as Flan from 'xenonjs/Library/CoreXenon/Framework/Flan.js';
import * as Persist from 'xenonjs/Library/CoreXenon/Framework/Persist.js';
import * as Library from 'xenonjs/Library/CoreXenon/Framework/Library.js'
import {loadGraph} from 'xenonjs/Library/CoreXenon/Designer/GraphService.js';
import {graph as BaseGraph} from '../Library/Graphs/Base.js';
import {graph as BuildGraph} from '../Library/Graphs/Build.js';

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');

const persistables = [
  'base$GraphList$graphAgent$selectedMeta',
  'base$GraphList$graphAgent$graphs',
  'base$WorkPanel$splitPanel$divider',
  'base$SplitPanel$splitPanel$divider',
  'base$UserSettings$settings$userSettings'
];

export const main = async (xenon, Composer) => {
  // tell xenon we need to make stuff
  await xenon.industrialize();
  // xenon.setPaths(Paths.map);
  // get offline data
  const persistations = await Persist.restore(persistables);
  const customLibraries = persistations?.$UserSettings$settings$userSettings?.customLibraries;
  const library = await loadLibraries(customLibraries);
  // map nodeTypes in from library
  persistations.base$NodeTypeList$typeList$nodeTypes = library.nodeTypes;
  persistations.base$GraphList$graphAgent$publishedGraphsUrl = `${globalThis.config.firebaseConfig.databaseURL}/${globalThis.config.publicGraphsPath}`;
  const graph = await loadGraph(Params.getParam('graph'));
  if (graph) {
    persistations.base$GraphList$graphAgent$graph = graph;
    const {id, owner, readonly} = graph.meta;
    persistations.base$GraphList$graphAgent$selectedMeta = {id, owner, readonly};
  }
  // create main flan
  const flan = globalThis.flan = Flan.createFlan(xenon.emitter, Composer, library, persistations);
  // debug access to API
  globalThis.Flan = Flan;
  // create base layer
  const base = await Flan.createLayer(flan, [BaseGraph, BuildGraph], 'base');
  // observe data changes
  base.onvalue = state => state && onValue(state);
  // ready
  log('Flan is ready 🍮');
};

const onValue = state => {
  maybeReload(state);
  Persist.persist(state, persistables);
};

const maybeReload = state => {
  if (state.$UserSettings$settings$userSettings) {
    location.reload();
  }
};

// Example custom libraries configuration:
// {
//   libraryAlso: 'xenonjs/LibraryAlso',
//   sjmilesCustom: 'https://customlibrary.sjmiles.repl.co',
//   customLibrary: 'https://customlibrary.xenonjs.repl.co'
// }
const loadLibraries = async (customLibraries) => {
  const libraries = {};
  if (keys(customLibraries)?.length > 0 && values(customLibraries).every(value => typeof value === 'string')) {
    assign(libraries, customLibraries);
  }
  const library = Library.importLibraries(libraries);
  library.customLibraries = customLibraries;
  return library;
};
