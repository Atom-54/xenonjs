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
import {jsonrepairService} from 'xenonjs/Library/jsonrepair/jsonrepairService.js';

const {create} = SafeObject;

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');
logf.flags.Main = true;

const persistables = [
  '$GraphList$graphAgent$selectedId',
  '$GraphList$graphAgent$graphs',
  '$WorkPanel$splitPanel$divider',
  '$SplitPanel$splitPanel$divider',
  '$CustomLib$field$text'
];

export const main = async (xenon, App, Composer) => {
  // configure design system 
  Design.configureDesignApp({xenon, Composer});
  // get offline data
  const persistations = await restore(persistables);
  const {nodeTypes, services} = await loadLibraries(persistations);
  persistations.$NodeTypeList$typeList$nodeTypes = nodeTypes;
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
//   sjmilesCustom: 'https://customlibrary.sjmiles.repl.co'
// }
const loadLibraries = async ({$CustomLib$field$text: librariesStr}) => {
  let libraries = {};
  if (librariesStr) {
    try {
      const {json} = await jsonrepairService.repair(null, null, {value: librariesStr});
      libraries = JSON.parse(json);
    } catch(e) {
      log.warn(`Failed to load libraries: ${librariesStr}`);
    }
  }
  return Library.importLibraries(libraries);
};
