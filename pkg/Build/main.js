/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {SafeObject} from 'xenonjs/Library/CoreReactor/safe-object.js';
import * as Persist from 'xenonjs/Library/CoreFramework/Persist.js';
// libraries provide objects and services that form the dependency layer for Graphs
import * as Library from 'xenonjs/Library/CoreFramework/Library.js'
// Graphs may request types and services from above
import {graph as BaseGraph} from '../Graphs/Base.js';
import {graph as BuildGraph} from '../Graphs/Build.js';
// for the app itself
import * as Design from 'xenonjs/Library/CoreDesigner/DesignApp.js';

const {create, assign, keys, values} = SafeObject;

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');
logf.flags.Main = true;

const persistables = [
  '$GraphList$graphAgent$selectedId',
  '$GraphList$graphAgent$graphs',
  '$WorkPanel$splitPanel$divider',
  '$SplitPanel$splitPanel$divider',
  '$UserSettings$settings$userSettings'
];

export const main = async (xenon, App, Composer) => {
  // get offline data
  const persistations = await restore(persistables);
  const customLibraries = persistations?.$UserSettings$settings$userSettings?.customLibraries;
  // configure design system 
  Design.configureDesignApp({xenon, Composer, customLibraries});
  const {nodeTypes, services} = await loadLibraries(customLibraries);
  persistations.$NodeTypeList$typeList$nodeTypes = nodeTypes;
  xenon.setPaths(Paths.map);
  // TODO(sjmiles): experimental: make layering more accessible
  App.createLayer.simple = async (graph, name) => {
    return await App.createLayer([graph], xenon.emitter, Composer, services, name);
  };
  // create app layer 
  const app = await App.createLayer([BaseGraph, BuildGraph], xenon.emitter, Composer, services);
  // set up initial state
  await App.initializeData(app);
  // might need to do this in concert with initializeData
  App.setData(app, persistations);
  // observe data
  app.onvalue = state => state && onValue(App, state);
  // ready
  log('app is live 🌈');
  globalThis.app = app;
  return app;
};

const restore = async persistables => {
  const state = create(null);
  for (let key of persistables) {
    state[key] = await Persist.restoreValue(key);
  }
  return state;
};

const onValue = (App, state) => {
  updateCustomDesignValues(App, state);
  maybeReload(state);
  persist(state, persistables);
};

const updateCustomDesignValues = (App, state) => {
  const {design} = globalThis;
  if (design) {
    const selected = state.$NodeGraph$Graph$selected;
    if (selected !== undefined) {
      // set app.selected to design.selected
      App.set(design, Design.designSelectedKey, selected);
    }
  }
};

const maybeReload = state => {
  if (state.$UserSettings$settings$userSettings) {
    location.reload();
  }
}

const persist = async (state, persistables) => {
  for (let key of persistables) {
    if (key in state) {
      Persist.persistValue(key, state[key]);
    }
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
  return Library.importLibraries(libraries);
};
