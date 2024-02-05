/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {Xen} from '../../Dom/Xen/xen-async.js';
import '../../../App/config.js';
import '../../Common/configKeys.js';
import {logf} from '../../CoreXenon/Reactor/Atomic/js/logf.js';
//import {loadCss} from '../../Dom/dom.js';
import * as Env from '../../Framework/Env.js';
import * as Library from '../../Xenon/Library.js';
import * as Controller from '../../Framework/Controller.js';
import * as Services from '../../Framework/Services.js';
import * as Layer from '../../Graph/Services/LayerService.js';
import {start} from '../../Common/start.js';
import * as services from '../../../App/services.js';
import * as Dom from '../../../App/dom.js';
import '../../../App/graphs.js';

const log = logf('Index', 'magenta');

// loadCss('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
//loadCss(globalThis.config.xenonPath + 'Library/Dom/Material/material-xen/xen.css');

globalThis.Graphs.Files = {
  "FirebasePublicFiles": {
    "type": "$library/Documents/Atoms/FileSystem",
    "state": {
      "providerId": "fb",
      "storeId": "Guest",
      "storeName": "Public (Firebase)"
    }
  }
};

const template = Xen.Template.html`
<style>
  xenon-graph {
    display: flex;
    flex-direction: column;
  }
  /* :host, [atom] {
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
  } */
  @font-face {
    font-family: 'Material Symbols Outlined';
    src: url(${globalThis.config.xenonPath + '/Library/Assets/symbols.woff2'}) format('woff2');
    font-display: block;
  }
</style>

<!-- <slot name="root" flex></slot> -->
`;

//let xenon;

export class XenonGraph extends Xen.Async {
  static get observedAttributes() {
    return ['name'];
  }
  get template() {
    return template;
  }
  get host() {
    return this;
  }
  async update({name}, state) {
    state.graph ??= await this.gogoGraph(name);
  }
  async gogoLayer() {

  }
  async gogoGraph(name) {
    await requireXenon();
    const {main} = globalThis;
    log(main);
    if (!main.composer) {
      main.composer = Dom.createComposer(main.onevent, this);
      // add helper graph
      const graph = await Layer.getGraphContent('Files');
      await Controller.reifyLayer(main, main.layers, 'Files', graph);
    }
    // add graph
    //const graphId = `FirstProject/KeyRecommendation`;
    setTimeout(async () => {
      const graphId = name;
      const graph = await Layer.getGraphContent(graphId);
      log.debug(graph);
      if (graph) {
        await Controller.reifyLayer(main, main.layers, 'aGraph', graph);
      }
      //Controller.set(main, 'run$PopOver', {show: true});
    }, 1000);
  }
}

const requireXenon = () => {
  if (!globalThis.env) {
    return bootXenon();
  }
};

const bootXenon = async () => {
  return start(async xenon => {
    // create a xenon environment
    const env = globalThis.env = Env.createEnv(xenon, Services.onservice, onrender);
    Library.importLibrary(env);
    Services.addServices(services);
    // make a controller
    const main = await Env.createController(env, 'main');
    globalThis.main = main;
  });
};

const onrender = async (host, packet) => {
  const {layer} = host;
  const {controller} = layer;
  if (controller.composer) {
    // TODO(sjmiles): doing this to avoid walking each sublayer to set all the 'root' containers; which way is simpler?
    packet.container = (host.container === 'root' && layer.host && `${layer.host.id}#Container`) || host.container; 
    const style = controller.state[`${host.id}$style`];
    if (style) {
      ((packet.content ??= {}).model ??= {}).style = style;
    }
    controller.composer.render(packet);
  }
};

customElements.define('xenon-graph', XenonGraph);
