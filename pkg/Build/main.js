/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {SafeObject} from 'xenonjs/Library/CoreReactor/safe-object.js';
import * as Persist from 'xenonjs/Library/CoreFramework/Persist.js';
import {Flan} from 'xenonjs/Library/CoreFramework/Flan.js';
// libraries provide objects and services that form the dependency layer for Graphs
import * as Library from 'xenonjs/Library/CoreFramework/Library.js'
// Graphs request types and services from libraries
import {graph as BaseGraph} from '../Library/Graphs/Base.js';
import {graph as BuildGraph} from '../Library/Graphs/Build.js';
// Design extensions
import * as Design from 'xenonjs/Library/CoreDesigner/DesignApp.js';

const {create, assign, keys, values} = SafeObject;

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');

const persistables = [
  '$GraphList$graphAgent$selectedId',
  '$GraphList$graphAgent$graphs',
  '$WorkPanel$splitPanel$divider',
  '$SplitPanel$splitPanel$divider',
  '$UserSettings$settings$userSettings'
];

export const main = async (xenon, App, Composer) => {
  await xenon.industrialize();
  // get offline data
  const persistations = await restore(persistables);
  const customLibraries = persistations?.$UserSettings$settings$userSettings?.customLibraries;
  // configure design system 
  Design.configureDesignApp({xenon, Composer, customLibraries});
  const {nodeTypes, services} = await loadLibraries(customLibraries);
  persistations.$NodeTypeList$typeList$nodeTypes = nodeTypes;
  xenon.setPaths(Paths.map);
  // create main flan
  const flan = globalThis.flan = new Flan(App, xenon.emitter, Composer, services, persistations);
  // create base layer
  const layer = await flan.createLayer([BaseGraph, BuildGraph], '');
  // observe data changes
  layer.onvalue = state => state && onValue(App, state);
  // ready
  log('app is live 🌈');
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
