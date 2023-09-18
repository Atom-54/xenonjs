/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// NOTE: This custom element is similar to the `Graph/Dom/graph-element.js`,
// and the two should probably be reconciled and unified.

import {Xen} from '../../Dom/Xen/xen-async.js';

import {connectXenon} from './connectXenon.js';
import * as Composer from '../../CoreXenon/Framework/Composer.js';
import {Flan} from '../../CoreXenon/Framework/Flan.js';
import {loadGraph} from '../../CoreXenon/Designer/GraphService.js';
import * as Library from '../../CoreXenon/Framework/Library.js'
import * as Persist from '../../CoreXenon/Framework/Persist.js';
import '../../Common/configKeys.js';

import {graph as baseGraph} from '../../Graphs/Base.js';
import '../../Fields/FieldsDom.js';
import '../../PixiJs/PixiJsDom.js';
import * as services from '../../services.js';

const template = Xen.Template.html`
<style>
  :host, [atom] {
    display: flex;
    flex-direction: column;
  }
  [name="root"] > * {
    height: 100%;
  }
  [atom] {
    border-style: solid;
    border-width: 0;
    overflow: hidden;
  }
</style>

<slot name="root" flex></slot>
`;

let xenon;

export class XenonGraph extends Xen.Async {
  static get observedAttributes() {
    return ['name'];
  }
  get template() {
    return template;
  }
  async update({name}, state) {
    if (state.name !== name) {
      state.name = name;
      xenon = xenon ?? (await this.initXenon());
      const graph = await loadGraph(state.name);
      if (graph) {
        const library = await this.loadLibraries(graph.meta, await Persist.restoreValue('$UserSettings$settings$userSettings'));        
        // create main flan
        const flan = globalThis.flan = new Flan(xenon.emitter, Composer, library);
        await this.reifyGraph(flan, graph);
      } else {
        console.log(`Graph not found.`);
      }
    }
  }
  async initXenon() {
    const {xenon} = await connectXenon();
    // await xenon.industrialize();
    return xenon;
  }
  async reifyGraph(flan, graph) {
    graph.state[`Main$designer$disabled`] = true;
    console.log(graph);
    //
    // create app with Atom emitter
    Composer.options.root = this.shadowRoot.querySelector('slot');
    console.log('setting Composer root to', Composer.options.root);
    flan.services = services;
    //
    const layer = await flan.createLayer([baseGraph, graph], '');
    //
    console.log('graph is live 🌈');
    //
    return layer;
  }
  async loadLibraries({customLibraries}, userSettings) {
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
}

customElements.define('xenon-graph', XenonGraph);
