/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// NOTE: This custom element is similar to the `Graph/Dom/graph-element.js`,
// and the two should probably be reconciled and unified.

import {Xen} from '../../Dom/Xen/xen-async.js';

import {connectXenon} from '../../CoreReactor/Worker/xenon-web-worker.js';
import * as App from '../../CoreFramework/App.js';
import * as Composer from '../../CoreFramework/Composer.js';
import {Flan} from '../../CoreFramework/Flan.js';
import {loadGraph} from '../../CoreDesigner/GraphService.js';
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

let xenon, flan;

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
      const graph = await loadGraph(state.name);
      if (graph) {
        xenon = xenon ?? (await this.initXenon());
        // create main flan
        globalThis.flan = flan = flan ?? new Flan(App, xenon.emitter, Composer);
        await this.reifyGraph(flan, graph);
      } else {
        console.log(`Graph not found.`);
      }
    }
  }
  async initXenon() {
    const {xenon/*, terminal*/} = await connectXenon();
    xenon.industrialize();
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
}

customElements.define('xenon-graph', XenonGraph);
