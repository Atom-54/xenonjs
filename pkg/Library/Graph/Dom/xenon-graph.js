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
import {loadGraph} from '../../CoreDesigner/GraphService.js';
import '../../../Apps/common/configKeys.js';

import {graph as baseGraph} from '../../../Graphs/Base.js';
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

globalThis.app = {
  // services: {},
  layers: {}
};

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
        await this.reifyGraph(graph);
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
  async reifyGraph(buildGraph) {
    buildGraph.state[`Main$designer$disabled`] = true;
    console.log(buildGraph);
    //
    // create app with Atom emitter
    Composer.options.root = this.shadowRoot.querySelector('slot');
    console.log('setting Composer root to', Composer.options.root);
    const layer = await App.createLayer([baseGraph, buildGraph], xenon.emitter, Composer, services, `Layer` + Math.floor(Math.random()*1000+1000));
    //
    await App.initializeData(layer);
    //
    console.log('graph is live 🌈');
    globalThis.app.layers[layer.name] = layer;
    //
    return layer;
  }
}

customElements.define('xenon-graph', XenonGraph);
